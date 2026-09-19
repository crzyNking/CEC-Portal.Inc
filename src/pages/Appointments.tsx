import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotification } from '../hooks/useNotification'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'
import { Calendar, Clock, Plus, X, ChevronDown } from 'lucide-react'

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
}

const OFFICES = [
  { value: 'registrar', label: 'Registrar Office' },
  { value: 'accounting', label: 'Accounting Office' },
  { value: 'guidance', label: 'Guidance Office' },
  { value: 'edp', label: 'EDP Office' },
  { value: 'dean', label: "Dean's Office" },
  { value: 'student_affairs', label: 'Student Affairs' },
  { value: 'library', label: 'Library' },
  { value: 'other', label: 'Other' },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  completed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  cancelled: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' },
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

export function Appointments() {
  const user = useAuthStore(s => s.user)
  const notify = useNotification()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState<Appointment | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    office: 'registrar',
    appointment_date: '',
    appointment_time: '',
  })

  useEffect(() => {
    if (!user?.id) return
    load()
  }, [user?.id])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('student_id', user!.id)
      .order('created_at', { ascending: false })
    if (data) setAppointments(data as Appointment[])
    setLoading(false)
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.appointment_date || !form.appointment_time) {
      notify.warning({ title: 'Please fill in all required fields' })
      return
    }
    const { error } = await supabase.from('appointments').insert({
      student_id: user!.id,
      title: form.title.trim(),
      description: form.description.trim(),
      office: form.office,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      status: 'pending',
    })
    if (error) {
      notify.error({ title: 'Failed to submit appointment', message: error.message })
      return
    }
    notify.success({ title: 'Appointment submitted', message: 'Your request has been sent for review.' })
    setShowForm(false)
    setForm({ title: '', description: '', office: 'registrar', appointment_date: '', appointment_time: '' })
    load()
  }

  async function handleCancel(id: string) {
    const { error } = await supabase.from('appointments').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id)
    if (error) {
      notify.error({ title: 'Could not cancel' })
      return
    }
    notify.success({ title: 'Appointment cancelled' })
    setDetail(null)
    load()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <StudentLayout title="Appointments">
      <div className="max-w-[1100px] mx-auto">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-[#0B1F3A]' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Approved', value: stats.approved, color: 'text-emerald-600' },
            { label: 'Completed', value: stats.completed, color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header + New Appointment */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#0B1F3A]">My Appointments</h1>
            <p className="text-[13px] text-gray-500">Schedule and manage office appointments.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-[#1E4E8C] text-white rounded-lg px-4 py-2.5 text-[12.5px] font-semibold flex items-center gap-1.5 hover:bg-[#0B1F3A] transition-colors">
            <Plus size={15} /> New Appointment
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'pending', 'approved', 'rejected', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${filter === f ? 'bg-[#1E4E8C] text-white border-[#1E4E8C]' : 'bg-white text-gray-600 border-[rgba(11,31,58,0.08)] hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* New Appointment Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0B1F3A]">New Appointment Request</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Purpose / Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Request for Transcript of Records"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20" required />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Office *</label>
                  <div className="relative">
                    <select value={form.office} onChange={e => setForm({ ...form, office: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 appearance-none focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20">
                      {OFFICES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Preferred Date *</label>
                  <input type="date" value={form.appointment_date} min={today}
                    onChange={e => setForm({ ...form, appointment_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20" required />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Preferred Time *</label>
                  <input type="time" value={form.appointment_time}
                    onChange={e => setForm({ ...form, appointment_time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20" required />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Description / Details</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide additional details about your appointment request..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#1E4E8C] focus:ring-2 focus:ring-[#1E4E8C]/20 resize-none" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-white border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#1E4E8C] text-white rounded-lg px-5 py-2 text-[12.5px] font-semibold hover:bg-[#0B1F3A] transition-colors">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments list */}
        {loading ? (
          <div className="text-center py-16 text-sm text-gray-500">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-[1.5px] border-dashed border-gray-200 rounded-[14px] bg-white">
            <div className="w-16 h-16 rounded-full bg-[rgba(30,78,140,0.08)] text-[#1E4E8C] flex items-center justify-center mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="m-0 mb-2 text-base font-bold text-[#0B1F3A]">No appointments found</h3>
            <p className="m-0 max-w-[360px] text-[13.5px] text-gray-500 leading-relaxed">
              {filter === 'all' ? "You haven't booked any appointments yet. Click 'New Appointment' to get started." : `No ${filter} appointments.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => {
              const st = STATUS_STYLES[a.status] || STATUS_STYLES.pending
              const officeLabel = OFFICES.find(o => o.value === a.office)?.label || a.office
              return (
                <div key={a.id} onClick={() => setDetail(a)}
                  className="bg-white rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-[14px] font-bold text-[#0B1F3A] m-0">{a.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(a.appointment_date)}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(a.appointment_time)}</span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-medium">{officeLabel}</span>
                      </div>
                      {a.description && <p className="text-[12.5px] text-gray-500 mt-2 m-0 line-clamp-2">{a.description}</p>}
                      {a.admin_notes && a.status !== 'pending' && (
                        <div className="mt-2 p-2.5 rounded-lg bg-gray-50 text-[12px] text-gray-600">
                          <span className="font-semibold text-gray-700">Admin note:</span> {a.admin_notes}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Detail modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-[480px] w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0B1F3A] m-0">{detail.title}</h2>
                <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between"><span className="text-gray-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLES[detail.status]?.bg} ${STATUS_STYLES[detail.status]?.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[detail.status]?.dot}`} />
                    {detail.status.charAt(0).toUpperCase() + detail.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Office</span><span className="font-medium text-gray-800">{OFFICES.find(o => o.value === detail.office)?.label || detail.office}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-gray-800">{formatDate(detail.appointment_date)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium text-gray-800">{formatTime(detail.appointment_time)}</span></div>
                {detail.description && <div><span className="text-gray-500 block mb-1">Description</span><p className="text-gray-800 m-0">{detail.description}</p></div>}
                {detail.admin_notes && <div><span className="text-gray-500 block mb-1">Admin Notes</span><p className="text-gray-800 m-0 p-2.5 bg-gray-50 rounded-lg">{detail.admin_notes}</p></div>}
                <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="text-gray-600">{new Date(detail.created_at).toLocaleString()}</span></div>
              </div>
              <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
                {(detail.status === 'pending' || detail.status === 'approved') && (
                  <button onClick={() => handleCancel(detail.id)}
                    className="bg-white border border-red-300 text-red-600 rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-red-50 transition-colors">
                    Cancel Appointment
                  </button>
                )}
                <button onClick={() => setDetail(null)}
                  className="bg-[#1E4E8C] text-white rounded-lg px-4 py-2 text-[12.5px] font-semibold hover:bg-[#0B1F3A] transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export default Appointments
