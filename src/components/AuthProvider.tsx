import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/authStore'
import { usePreferencesStore } from '../store/preferencesStore'
import { useActivityStore } from '../store/activityStore'
import { supabase } from '../lib/supabase'

interface AuthProviderProps {
  children: ReactNode
}

const PROFILE_REFRESH_INTERVAL = 60_000

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, setLoading, fetchProfile } = useAuthStore()
  const { fetchPreferences } = usePreferencesStore()
  const { logActivity } = useActivityStore()

  useEffect(() => {
    let profileChannel: ReturnType<typeof supabase.channel> | null = null

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await Promise.all([
            fetchProfile(session.user.id),
            fetchPreferences(session.user.id),
          ])
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Realtime: when the logged-in user's profile row changes (e.g. role toggled
    // to admin by an admin), refetch it so the Admin button appears instantly.
    const setupProfileRealtime = () => {
      const userId = useAuthStore.getState().user?.id
      if (!userId) return

      if (profileChannel) {
        supabase.removeChannel(profileChannel)
        profileChannel = null
      }

      profileChannel = supabase
        .channel(`profile-realtime-${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          () => { fetchProfile(userId) }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            if (profileChannel) supabase.removeChannel(profileChannel)
            profileChannel = null
            setTimeout(setupProfileRealtime, 5000)
          }
        })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await Promise.all([
            fetchProfile(session.user.id),
            fetchPreferences(session.user.id),
          ])
          if (event === 'SIGNED_IN') {
            await logActivity(session.user.id, 'sign_in')
          }
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            setupProfileRealtime()
          }
        } else {
          if (profileChannel) {
            supabase.removeChannel(profileChannel)
            profileChannel = null
          }
          useAuthStore.getState().setProfile(null)
          usePreferencesStore.getState().clearPreferences()
        }
        setLoading(false)
      }
    )

    const profileTimeout = setTimeout(setupProfileRealtime, 1000)
    // Backup: refetch profile on focus / visibility / periodically, so role
    // changes still propagate even if realtime is unavailable.
    const refreshProfile = () => {
      const userId = useAuthStore.getState().user?.id
      if (userId && document.visibilityState === 'visible' && navigator.onLine) {
        fetchProfile(userId)
      }
    }

    const onFocus = () => refreshProfile()
    const onVisibility = () => refreshProfile()
    const interval = setInterval(refreshProfile, PROFILE_REFRESH_INTERVAL)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      subscription.unsubscribe()
      clearTimeout(profileTimeout)
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      if (profileChannel) supabase.removeChannel(profileChannel)
    }
  }, [setUser, setSession, setLoading, fetchProfile, fetchPreferences, logActivity])

  return <>{children}</>
}
