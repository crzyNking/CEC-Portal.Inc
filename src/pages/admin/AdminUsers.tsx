import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface UserProfile { id: string; email: string | null; full_name: string | null; avatar_url: string | null; role: string; created_at: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function toggleRole(user: UserProfile) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change ${user.full_name || user.email} to ${newRole}?`)) return
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
      if (error) throw error
      await logAdminActivity('toggled', 'user', user.id, { full_name: user.full_name, email: user.email, new_role: newRole })
      addNotification({ type: 'success', title: 'Role updated' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Users ({users.length})</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
      : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E4E8C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : (u.full_name?.[0] || u.email?.[0]?.toUpperCase() || '?')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{u.full_name || 'No name'}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleRole(u)} className="text-[#1E4E8C] hover:text-[#0B1F3A] hover:underline text-xs font-medium">
                      {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
