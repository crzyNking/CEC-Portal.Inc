import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'
import ConfirmModal from '../../components/ConfirmModal'

interface Inquiry {
  id: string
  student_id: string
  department: string
  subject: string
  message: string
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  admin_notes: string
  handled_by: string | null
  created_at: string
  updated_at: string
  student_name?: string
}

const DEPARTMENTS: Record<string, string> = {
  registrar: "Registrar's Office",
  accounting: 'Accounting & Cashier',
  edp: 'EDP Office',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500',
}

export default function AdminInquiries() {
  const user = useAuthStore(s => s.user)
  const addNotification = useNotificationStore(s => s.addNotification)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      const sids = [...new Set(data.map(i => i.student_id))]
      let nameMap: Record<string, string> = {}
      if (sids.length) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', sids)
        profiles?.forEach(p => { nameMap[p.id] = p.full_name || 'Student' })
      }
      setInquiries(data.map(i => ({ ...i, student_name: nameMap[i.student_id] || 'Student' })))
    }
    setLoading(false)
  }

  const filtered = inquiries.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false
    if (deptFilter !== 'all' && i.department !== deptFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return i.subject.toLowerCase().includes(q) || (i.student_name || '').toLowerCase().includes(q) || i.message.toLowerCase().includes(q)
    }
    return true
  })

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    in_progress: inquiries.filter(i => i.status === 'in_progress').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('inquiries').update({
      status,
      admin_notes: notes.trim(),
      handled_by: user?.id,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) {
      addNotification({ type: 'error', title: 'Failed to update inquiry', message: error.message })
      return
    }
    await logAdminActivity(status, 'inquiry', id)
    addNotification({ type: 'success', title: `Inquiry ${status.replace('_', ' ')}` })
    setDetail(null)
    setNotes('')
    load()
  }

  async function remove(id: string) {
    const { error } = await supabase.from('inquiries').delete().eq('id', id)
    if (error) {
      addNotification({ type: 'error', title: 'Failed to delete' })
      return
    }
    await logAdminActivity('deleted', 'inquiry', id)
    addNotification({ type: 'success', title: 'Inquiry deleted' })
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Inquiries</h1>
          <p className="text-gray-500 text-sm">Student help desk tickets and inquiries.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
          { label: 'In Progress', value: stats.in_progress, color: 'bg-cyan-500' },
          { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-500' },
        ].map(s => (
          <div key={s.label} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{s.value}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or subject..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Departments</option>
          {Object.entries(DEPARTMENTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Department</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No inquiries found.</td></tr>
              ) : filtered.map(i => (
                <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{i.student_name}</div>
                    <div className="text-xs text-gray-500">{i.student_id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0B1F3A] max-w-xs truncate">{i.subject}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">{DEPARTMENTS[i.department] || i.department}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[i.status] || ''}`}>
                      {i.status.replace('_', ' ').charAt(0).toUpperCase() + i.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(i.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => { setDetail(i); setNotes(i.admin_notes || '') }}
                      className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-semibold hover:underline">View</button>
                    <button onClick={() => setDeleteTarget(i)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-[520px] w-full p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] m-0">{detail.subject}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-3 text-[13px] mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium text-gray-800">{detail.student_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Department</span><span className="font-medium text-gray-800">{DEPARTMENTS[detail.department] || detail.department}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[detail.status]}`}>{detail.status.replace('_', ' ')}</span>
              </div>
              <div><span className="text-gray-500 block mb-1">Message</span><p className="text-gray-800 m-0 bg-gray-50 p-2.5 rounded-lg whitespace-pre-wrap">{detail.message}</p></div>
            </div>

            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Add notes or resolution details..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20 resize-none" />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              {detail.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(detail.id, 'in_progress')}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-blue-700 transition-colors">Start Progress</button>
                  <button onClick={() => updateStatus(detail.id, 'resolved')}
                    className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-emerald-700 transition-colors">Resolve</button>
                </>
              )}
              {detail.status === 'in_progress' && (
                <button onClick={() => updateStatus(detail.id, 'resolved')}
                  className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-emerald-700 transition-colors">Resolve</button>
              )}
              {detail.status === 'resolved' && (
                <button onClick={() => updateStatus(detail.id, 'closed')}
                  className="bg-gray-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-gray-700 transition-colors">Close</button>
              )}
              <button onClick={() => setDetail(null)}
                className="bg-white border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Inquiry"
        message={`Are you sure you want to delete the inquiry "${deleteTarget?.subject || 'this inquiry'}"? This cannot be undone.`}
        confirmLabel="Delete" danger onConfirm={() => deleteTarget && remove(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}
