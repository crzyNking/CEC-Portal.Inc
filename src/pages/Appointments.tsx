import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

interface DocumentRequest {
  id: string
  student_id: string
  doc_type: string
  purpose: string
  status: string
  notes: string
  created_at: string
  updated_at: string
}

const DOC_TYPES = [
  'Good Moral Certificate',
  'Transcript of Records',
  'Honorable Dismissal',
  'Certified True Copy of Grades',
  'Diploma',
  'Certificate of Enrollment',
  'Certificate of Graduation',
  'Other',
]

const statusColors: Record<string, string> = {
  pending: 'bg-[#FFF8E6] text-[#D4A017]',
  processing: 'bg-[#D5EBF9]/60 text-[#2F5DD4]',
  ready: 'bg-[#E6F7ED] text-[#0F9D58]',
  completed: 'bg-[#E6F7ED] text-[#0F9D58]',
  rejected: 'bg-[#FDECEB] text-[#E4483F]',
}

export default function Appointments() {
  const user = useAuthStore((s) => s.user)
  const notify = useNotification()
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [docType, setDocType] = useState(DOC_TYPES[0])
  const [purpose, setPurpose] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('document_requests').select('*').order('created_at', { ascending: false })
      if (data) setRequests(data)
      setLoading(false)
    }
    load()
  }, [user])

  const handleSubmit = async () => {
    if (!user || !purpose.trim()) {
      notify.error({ title: 'Required', message: 'Please enter a purpose for your request.' })
      return
    }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('document_requests').insert({
        doc_type: docType,
        purpose: purpose.trim(),
        status: 'pending',
        notes: '',
      })
      if (error) throw error
      notify.success({ title: 'Request Submitted', message: `Your ${docType} request has been submitted.` })
      setShowForm(false)
      setPurpose('')
      const { data } = await supabase.from('document_requests').select('*').order('created_at', { ascending: false })
      if (data) setRequests(data)
    } catch (err: any) {
      notify.error({ title: 'Error', message: err.message || 'Failed to submit request.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StudentLayout title="Appointments">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold text-[#14213D]">Document Requests</h1>
          <p className="text-[12px] text-[#7A8299] mt-0.5">Request official documents from the Registrar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg bg-[#2F5DD4] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors">
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-5">
          <h3 className="text-[14px] font-bold text-[#14213D] mb-3">New Document Request</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Document Type</label>
              <select value={docType} onChange={e => setDocType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]">
                {DOC_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Purpose</label>
              <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]"
                placeholder="e.g. Job application" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting || !purpose.trim()}
            className="px-5 py-2 rounded-lg bg-[#0F9D58] hover:bg-[#0D8A4C] text-white text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#14213D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#E6E8EE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E6E8EE] bg-[#F8F9FB]">
                  <th className="text-[11px] font-semibold text-[#7A8299] p-3">Document</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] p-3">Purpose</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] p-3">Date</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} className="border-b border-[#F0F2F7] last:border-0 hover:bg-[#F8F9FB]">
                    <td className="p-3 text-[12.5px] font-medium text-[#14213D]">{r.doc_type}</td>
                    <td className="p-3 text-[12px] text-[#525A6E]">{r.purpose || '—'}</td>
                    <td className="p-3 text-[12px] text-[#7A8299]">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[r.status] || 'bg-[#EEF1F8] text-[#7A8299]'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E6E8EE]">
          <div className="w-12 h-12 rounded-full bg-[#EEF1F8] flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9AA1B5" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
          </div>
          <p className="text-[13px] text-[#7A8299] font-medium">No document requests yet</p>
          <p className="text-[11px] text-[#9AA1B5] mt-1">Click "New Request" to get started</p>
        </div>
      )}
    </StudentLayout>
  )
}
