import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const ADMIN_ROLES = ['super_admin', 'registrar', 'edp', 'accounting', 'faculty', 'other_admin', 'admin']

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: string[]
  permissions: string[]
  loading: boolean
  error: string | null
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  fetchPermissions: (userId: string) => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchProfile: (userId: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  uploadAvatar: (file: File) => Promise<string | null>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  roles: [],
  permissions: [],
  loading: true,
  error: null,
  isAdmin: () => ADMIN_ROLES.includes(get().profile?.role || ''),
  isSuperAdmin: () => get().profile?.role === 'super_admin',
  hasRole: (role) => get().roles.includes(role) || get().profile?.role === role,
  hasPermission: (permission) =>
    get().profile?.role === 'super_admin' || get().permissions.includes(permission),
  fetchPermissions: async (userId: string) => {
    try {
      const profile = get().profile
      if (profile?.role === 'super_admin') {
        const { data } = await supabase.from('permissions').select('id')
        set({ permissions: (data || []).map((p: { id: string }) => p.id) })
        return
      }
      const roleIds = new Set<string>()
      if (profile?.role) roleIds.add(profile.role)
      const { data: userRoleRows } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId)
      userRoleRows?.forEach((u: { role_id: string }) => roleIds.add(u.role_id))
      if (roleIds.size === 0) {
        set({ permissions: [] })
        return
      }
      const { data: rpRows } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', [...roleIds])
      set({ permissions: [...new Set((rpRows || []).map((r: { permission_id: string }) => r.permission_id))] })
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  },
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      set({ profile: data })
      await get().fetchPermissions(data.id)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  },
  signInWithGoogle: async () => {
    set({ error: null })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign in' })
    }
  },
  signInWithEmail: async (email: string, password: string): Promise<boolean> => {
    set({ error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      if (data.user && data.session) {
        set({ user: data.user, session: data.session })
        await useAuthStore.getState().fetchProfile(data.user.id)
        return true
      }
      return false
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign in' })
      return false
    }
  },
  signUpWithEmail: async (email: string, password: string, fullName: string): Promise<{ success: boolean; message: string }> => {
    set({ error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Check if email already exists (no identities means email was already registered)
        if (data.user.identities?.length === 0) {
          return { success: false, message: 'An account with this email already exists.' }
        }

        if (data.session) {
          // Email confirmation is disabled, user is signed in immediately
          set({ user: data.user, session: data.session })
          await useAuthStore.getState().fetchProfile(data.user.id)
          return { success: true, message: 'Account created successfully!' }
        } else {
          // Email confirmation is enabled - email was sent
          return { success: true, message: 'Please check your email to confirm your account.' }
        }
      }
      return { success: false, message: 'Failed to create account' }
    } catch (error) {
      console.error('Sign up error:', error)
      const message = error instanceof Error ? error.message : 'Failed to sign up'
      set({ error: message })
      return { success: false, message }
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, profile: null, roles: [], permissions: [] })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign out' })
    }
  },
  uploadAvatar: async (file: File): Promise<string | null> => {
    const userId = (await supabase.auth.getUser()).data.user?.id
    if (!userId) {
      set({ error: 'Not authenticated' })
      return null
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`

      await supabase.storage.from('avatars').remove([fileName])

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (updateError) throw updateError

      set((state) => ({
        profile: state.profile ? { ...state.profile, avatar_url: avatarUrl } : null
      }))

      return avatarUrl
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload avatar' })
      return null
    }
  },
}))
