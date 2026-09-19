import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface Appointment {
  id: string
  student_id: string
  title: string
  description: string
  office: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  admin_notes: string
  handled_by: string | null
  created_at: string
  updated_at: string
  student_name?: string
}

const OFFICES: Record<string, string> = {
  registrar: 'Registrar', accounting: 'Accounting', guidance: 'Guidance',
  edp: 'EDP', dean: "Dean's Office", student_affairs: 'Student Affairs',
  library: 'Library', other: 'Other',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function AdminAppointments() {
  const user = useAuthStore(s => s.user)
  const addNotification = useNotificationStore(s => s.addNotification)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Appointment | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false })
    if (data) {
      const sids = [...new Set(data.map(a => a.student_id))]
      let nameMap: Record<string, string> = {}
      if (sids.length) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', sids)
        profiles?.forEach(p => { nameMap[p.id] = p.full_name || 'Student' })
      }
      setAppointments(data.map(a => ({ ...a, student_name: nameMap[a.student_id] || 'Student' })))
    }
    setLoading(false)
  }

  const filtered = appointments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (officeFilter !== 'all' && a.office !== officeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return a.title.toLowerCase().includes(q) || (a.student_name || '').toLowerCase().includes(q)
    }
    return true
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    today: appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length,
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('appointments').update({
      status,
      admin_notes: notes.trim(),
      handled_by: user?.id,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) {
      addNotification({ type: 'error', title: 'Failed to update appointment', message: error.message })
      return
    }
    await logAdminActivity(status, 'appointment', id)
    addNotification({ type: 'success', title: `Appointment ${status}` })
    setDetail(null)
    setNotes('')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage student appointment requests across all offices.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
          { label: 'Approved', value: stats.approved, color: 'bg-emerald-500' },
          { label: "Today's", value: stats.today, color: 'bg-purple-500' },
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or title..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
        <select value={officeFilter} onChange={e => setOfficeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Offices</option>
          {Object.entries(OFFICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Purpose</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Office</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Schedule</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No appointments found.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{a.student_name}</div>
                    <div className="text-xs text-gray-500">{a.student_id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]">{a.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">{OFFICES[a.office] || a.office}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {fmtDate(a.appointment_date)}<br />{fmtTime(a.appointment_time)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[a.status] || ''}`}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setDetail(a); setNotes(a.admin_notes || '') }}
                      className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-semibold hover:underline">
                      View
                    </button>
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
              <h2 className="text-lg font-bold text-[#0B1F3A] m-0">{detail.title}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-3 text-[13px] mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium text-gray-800">{detail.student_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Office</span><span className="font-medium text-gray-800">{OFFICES[detail.office] || detail.office}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-gray-800">{fmtDate(detail.appointment_date)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium text-gray-800">{fmtTime(detail.appointment_time)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[detail.status]}`}>{detail.status.charAt(0).toUpperCase() + detail.status.slice(1)}</span>
              </div>
              {detail.description && <div><span className="text-gray-500 block mb-1">Description</span><p className="text-gray-800 m-0 bg-gray-50 p-2.5 rounded-lg">{detail.description}</p></div>}
            </div>

            {/* Admin Notes */}
            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Add notes for the student..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20 resize-none" />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              {detail.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(detail.id, 'approved')}
                    className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-emerald-700 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => updateStatus(detail.id, 'rejected')}
                    className="bg-red-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </>
              )}
              {detail.status === 'approved' && (
                <button onClick={() => updateStatus(detail.id, 'completed')}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-blue-700 transition-colors">
                  Mark Completed
                </button>
              )}
              <button onClick={() => setDetail(null)}
                className="bg-white border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
