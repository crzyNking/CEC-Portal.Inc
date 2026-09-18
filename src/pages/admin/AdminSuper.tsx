import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import ConfirmModal from '../../components/ConfirmModal'

interface Role { id: string; label: string; description: string | null; sort_order: number | null }
interface Permission { id: string; label: string; description: string | null }
interface RolePermission { role_id: string; permission_id: string }
interface UserRole { user_id: string; role_id: string }
interface ProfileRow { id: string; email: string | null; full_name: string | null; role: string; created_at: string }
interface EnrollmentRow { student_id: string | null; id_number: string | null; claimed_at: string | null; level: string }

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  registrar: 'bg-blue-100 text-blue-700',
  edp: 'bg-cyan-100 text-cyan-700',
  accounting: 'bg-emerald-100 text-emerald-700',
  faculty: 'bg-amber-100 text-amber-700',
  other_admin: 'bg-rose-100 text-rose-700',
  student: 'bg-gray-100 text-gray-600',
}

export default function AdminSuper() {
  const [tab, setTab] = useState<'departments' | 'users' | 'roles' | 'create'>('departments')
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [users, setUsers] = useState<ProfileRow[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newRole, setNewRole] = useState('registrar')
  const [creating, setCreating] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => {} })
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { user } = useAuthStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [rolesRes, permRes, rpRes, urRes, profilesRes, enrRes] = await Promise.all([
        supabase.from('roles').select('*').order('sort_order'),
        supabase.from('permissions').select('*').order('id'),
        supabase.from('role_permissions').select('*'),
        supabase.from('user_roles').select('*'),
        supabase.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }),
        supabase.from('enrollment_submissions').select('student_id, id_number, claimed_at, level').order('created_at', { ascending: false }),
      ])
      if (rolesRes.error) throw rolesRes.error
      if (permRes.error) throw permRes.error
      if (rpRes.error) throw rpRes.error
      if (urRes.error) throw urRes.error
      if (profilesRes.error) throw profilesRes.error
      if (enrRes.error) throw enrRes.error
      setRoles(rolesRes.data || [])
      setPermissions(permRes.data || [])
      setRolePermissions(rpRes.data || [])
      setUserRoles(urRes.data || [])
      setUsers(profilesRes.data || [])
      setEnrollments(enrRes.data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => { load() }, [load])

  const userCountFor = (roleId: string) =>
    users.filter((u) => u.role === roleId).length + userRoles.filter((ur) => ur.role_id === roleId && !users.some((u) => u.id === ur.user_id && u.role === roleId)).length

  const permsFor = (roleId: string) => rolePermissions.filter((rp) => rp.role_id === roleId).map((rp) => rp.permission_id)

  const grantPermission = async (roleId: string, permissionId: string) => {
    try {
      const { error } = await supabase.from('role_permissions').insert({ role_id: roleId, permission_id: permissionId })
      if (error) throw error
      await logAdminActivity('granted', 'permission', undefined, { role: roleId, permission: permissionId })
      addNotification({ type: 'success', title: 'Permission granted' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to grant', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const revokePermission = async (roleId: string, permissionId: string) => {
    try {
      const { error } = await supabase.from('role_permissions').delete().eq('role_id', roleId).eq('permission_id', permissionId)
      if (error) throw error
      await logAdminActivity('revoked', 'permission', undefined, { role: roleId, permission: permissionId })
      addNotification({ type: 'success', title: 'Permission revoked' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to revoke', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const togglePermission = (roleId: string, permissionId: string) => {
    const has = permsFor(roleId).includes(permissionId)
    if (roleId === 'super_admin') {
      addNotification({ type: 'warning', title: 'Super Admin always has full access' })
      return
    }
    setConfirmState({
      open: true,
      title: has ? 'Revoke permission' : 'Grant permission',
      message: has
        ? `Remove "${permissionId}" from role "${roleId}"? Users with this role will lose access immediately.`
        : `Grant "${permissionId}" to role "${roleId}"?`,
      onConfirm: () => { setConfirmState({ open: false, title: '', message: '', onConfirm: () => {} }); has ? revokePermission(roleId, permissionId) : grantPermission(roleId, permissionId) },
    })
  }

  const assignRoleToUser = async (userId: string, roleId: string) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('role, email, full_name').eq('id', userId).single()
      if (profile?.role !== roleId) {
        const { error: updErr } = await supabase.from('profiles').update({ role: roleId }).eq('id', userId)
        if (updErr) throw updErr
      }
      const { error: urErr } = await supabase.from('user_roles').upsert({ user_id: userId, role_id: roleId, assigned_by: user?.id }, { onConflict: 'user_id,role_id' })
      if (urErr) throw urErr
      await logAdminActivity('assigned', 'role', userId, { role: roleId, email: profile?.email })
      addNotification({ type: 'success', title: 'Role assigned' })
      setAssigning(null)
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to assign role', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const removeUserRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role_id', roleId)
      if (error) throw error
      await logAdminActivity('removed', 'role', userId, { role: roleId })
      addNotification({ type: 'success', title: 'Role removed' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to remove role', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const createAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      if (!data.user) throw new Error('Failed to create account')
      if (data.user.identities?.length === 0) throw new Error('An account with this email already exists')

      const { error: updErr } = await supabase.from('profiles').update({ role: newRole }).eq('id', data.user.id)
      if (updErr) throw updErr
      const { error: urErr } = await supabase.from('user_roles').insert({ user_id: data.user.id, role_id: newRole, assigned_by: user?.id })
      if (urErr) throw urErr

      await logAdminActivity('created', 'admin_account', data.user.id, { email: email.trim(), role: newRole })
      addNotification({ type: 'success', title: 'Admin account created', message: `${email.trim()} was created with role "${newRole}". A confirmation email was sent.` })
      setEmail('')
      setPassword('')
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to create admin account', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setCreating(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q)
  })

  const enrollmentFor = (userId: string) => enrollments.find((e) => e.student_id === userId)
  const extraRolesFor = (userId: string) => userRoles.filter((ur) => ur.user_id === userId && ur.role_id !== users.find((u) => u.id === userId)?.role)

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
  }

  const tabs = [
    { key: 'departments' as const, label: 'Departments' },
    { key: 'users' as const, label: 'All Users' },
    { key: 'roles' as const, label: 'Roles & Permissions' },
    { key: 'create' as const, label: 'Create Admin' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Super Admin</h1>
          <p className="text-gray-500 text-sm">Full control over departments, users, roles, and permissions.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-[#1E4E8C] text-white' : 'bg-white/80 text-gray-600 hover:bg-white border border-[rgba(11,31,58,0.08)]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div key={r.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[r.id] || 'bg-gray-100 text-gray-600'}`}>{r.label}</span>
                <span className="text-xs text-gray-400">{userCountFor(r.id)} user{userCountFor(r.id) === 1 ? '' : 's'}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{r.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {permsFor(r.id).length === 0
                  ? <span className="text-xs text-gray-400 italic">{r.id === 'super_admin' ? 'Full access (all permissions)' : 'No permissions'}</span>
                  : permsFor(r.id).map((p) => (
                    <span key={p} className="text-[10px] bg-[#1E4E8C]/8 text-[#1E4E8C] px-2 py-0.5 rounded">{p}</span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-bold text-gray-800">User Accounts ({filteredUsers.length})</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Enrollment</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const enr = enrollmentFor(u.id)
                  const extras = extraRolesFor(u.id)
                  return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{u.full_name || 'No name'}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                        {extras.map((ex) => (
                          <span key={ex.role_id} className="ml-1 inline-flex items-center gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_COLORS[ex.role_id] || 'bg-gray-100 text-gray-600'}`}>{ex.role_id}</span>
                            <button onClick={() => removeUserRole(u.id, ex.role_id)} className="text-red-400 hover:text-red-600 text-[10px]">&times;</button>
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{enr?.id_number || '—'}</td>
                      <td className="px-4 py-3">
                        {enr ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${enr.student_id ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {enr.student_id ? 'claimed' : 'unclaimed'}
                          </span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setAssigning(assigning === u.id ? null : u.id)} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium">
                          {assigning === u.id ? 'Cancel' : 'Assign Role'}
                        </button>
                        {assigning === u.id && (
                          <div className="mt-2 flex gap-1.5 justify-end flex-wrap">
                            {roles.filter((r) => r.id !== u.role).map((r) => (
                              <button key={r.id} onClick={() => assignRoleToUser(u.id, r.id)}
                                className={`px-2 py-1 rounded text-[10px] font-medium ${ROLE_COLORS[r.id] || 'bg-gray-100 text-gray-600'} hover:opacity-80`}>
                                {r.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'roles' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Click a permission chip to grant or revoke it for that role. Super Admin always has full access.</p>
          {roles.map((r) => (
            <div key={r.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[r.id] || 'bg-gray-100 text-gray-600'}`}>{r.label}</span>
                <span className="text-xs text-gray-400">{r.id}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {permissions.map((p) => {
                  const has = r.id === 'super_admin' || permsFor(r.id).includes(p.id)
                  return (
                    <button key={p.id} onClick={() => togglePermission(r.id, p.id)} title={p.description || p.id}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${has ? 'bg-green-500/10 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                      {has ? '✓ ' : '+ '}{p.id}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] max-w-lg">
          <h2 className="font-bold text-gray-800 mb-1">Create Admin Account</h2>
          <p className="text-sm text-gray-500 mb-5">Creates a real Supabase Auth account and assigns the selected role. A confirmation email will be sent to the new admin.</p>
          <form onSubmit={createAdminAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              <p className="text-[11px] text-gray-400 mt-1">Share this password with the new admin securely. They can change it after logging in.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]">
                {roles.filter((r) => r.id !== 'student').map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={creating}
              className="w-full py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] disabled:opacity-50 transition-colors">
              {creating ? 'Creating account...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      )}

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="Confirm"
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ open: false, title: '', message: '', onConfirm: () => {} })}
      />
    </div>
  )
}
