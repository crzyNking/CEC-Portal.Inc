import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import ConfirmModal from '../../components/ConfirmModal'

interface EnrollmentRow {
  id: string; level: string; first_name: string; middle_name: string; last_name: string;
  id_number: string | null; student_id: string | null; claimed_at: string | null;
  degree_program: string | null; grade_level: string | null; status: string; created_at: string;
  age: string; dob: string; gender: string; civil_status: string;
  high_school: string; year_graduated: string; lrn: string;
  parent_name: string; parent_email: string; parent_contact: string;
  parent_occupation: string; address: string;
  emergency_contact: string; emergency_phone: string;
  requirements: Record<string, boolean>;
}

interface AcademicRecord {
  id: string; student_id: string; enrollment_id: string; subject: string; grade: string;
  semester: string; school_year: string; remarks: string; created_at: string;
}

interface DocumentRequest {
  id: string; student_id: string; enrollment_id: string; student_name: string;
  doc_type: string; status: string; notes: string; requested_at: string; processed_at: string | null;
}

interface ProfileRow { id: string; email: string | null; full_name: string | null; role: string; }

interface BillingAccount {
  id: string; student_id: string | null; enrollment_id: string | null;
  student_name: string; level: string; school_year: string; semester: string;
  tuition_fee: number; misc_fees: number; discount: number; total_due: number;
  balance: number; status: string; created_at: string;
}

interface Payment {
  id: string; billing_id: string; amount: number; method: string;
  reference_no: string; paid_at: string; verified: boolean;
  verified_by: string | null; verified_at: string | null;
}

export default function AdminRegistrar() {
  const [tab, setTab] = useState<'enrollment' | 'academic' | 'documents' | 'reports'>('enrollment')
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [academic, setAcademic] = useState<AcademicRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRequest[]>([])
  const [students, setStudents] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [claimFilter, setClaimFilter] = useState('all')
  const [academicForm, setAcademicForm] = useState({ student_id: '', enrollment_id: '', subject: '', grade: '', semester: '', school_year: '', remarks: '' })
  const [docForm, setDocForm] = useState({ student_id: '', enrollment_id: '', student_name: '', doc_type: '', notes: '' })
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => {} })
  const [detailView, setDetailView] = useState<EnrollmentRow | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailAcademic, setDetailAcademic] = useState<AcademicRecord[]>([])
  const [detailDocuments, setDetailDocuments] = useState<DocumentRequest[]>([])
  const [detailBilling, setDetailBilling] = useState<BillingAccount[]>([])
  const [detailPayments, setDetailPayments] = useState<Payment[]>([])
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { user } = useAuthStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [enrRes, acRes, docRes, stuRes] = await Promise.all([
        supabase.from('enrollment_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('academic_records').select('*').order('created_at', { ascending: false }),
        supabase.from('document_requests').select('*').order('requested_at', { ascending: false }),
        supabase.from('profiles').select('id, email, full_name, role').eq('role', 'student'),
      ])
      if (enrRes.error) throw enrRes.error
      if (acRes.error) throw acRes.error
      if (docRes.error) throw docRes.error
      if (stuRes.error) throw stuRes.error
      setEnrollments(enrRes.data || [])
      setAcademic(acRes.data || [])
      setDocuments(docRes.data || [])
      setStudents(stuRes.data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => { load() }, [load])

  const loadDetail = async (enrollment: EnrollmentRow) => {
    setDetailLoading(true)
    setDetailView(enrollment)
    try {
      const [acRes, docRes, billRes, payRes] = await Promise.all([
        supabase.from('academic_records').select('*').eq('student_id', enrollment.student_id).order('created_at', { ascending: false }),
        supabase.from('document_requests').select('*').eq('student_id', enrollment.student_id).order('requested_at', { ascending: false }),
        supabase.from('billing_accounts').select('*').eq('student_id', enrollment.student_id).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').eq('billing_id', '').order('paid_at', { ascending: false }), // will filter client-side
      ])
      if (acRes.error) throw acRes.error
      if (docRes.error) throw docRes.error
      if (billRes.error) throw billRes.error
      if (payRes.error) throw payRes.error

      // Filter payments for this student's billing accounts
      const billingIds = (billRes.data || []).map(b => b.id)
      const studentPayments = (payRes.data || []).filter(p => billingIds.includes(p.billing_id))

      setDetailAcademic(acRes.data || [])
      setDetailDocuments(docRes.data || [])
      setDetailBilling(billRes.data || [])
      setDetailPayments(studentPayments)
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load details', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setDetailLoading(false)
    }
  }

  const filteredEnrollments = enrollments.filter((e) => {
    const q = search.toLowerCase()
    const name = `${e.first_name} ${e.middle_name || ''} ${e.last_name}`.toLowerCase()
    return (
      (!q || name.includes(q) || e.id_number?.includes(q) || e.parent_name?.toLowerCase().includes(q)) &&
      (levelFilter === 'all' || e.level === levelFilter) &&
      (statusFilter === 'all' || e.status === statusFilter) &&
      (claimFilter === 'all' || (claimFilter === 'claimed' ? !!e.student_id : !e.student_id))
    )
  })

  const regenerateId = async (enrollmentId: string) => {
    try {
      const { data: newId, error } = await supabase.rpc('regenerate_student_id_number', { p_submission_id: enrollmentId })
      if (error) throw error
      await logAdminActivity('regenerated', 'id_number', enrollmentId, { new_id: newId })
      addNotification({ type: 'success', title: 'ID Number regenerated', message: `New ID: ${newId}` })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to regenerate', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const updateEnrollmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('enrollment_submissions').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      await logAdminActivity('updated', 'enrollment_status', id, { status })
      addNotification({ type: 'success', title: 'Status updated' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addAcademicRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('academic_records').insert({
        ...academicForm, created_by: user?.id,
      })
      if (error) throw error
      await logAdminActivity('created', 'academic_record', undefined, { subject: academicForm.subject })
      addNotification({ type: 'success', title: 'Academic record added' })
      setAcademicForm({ student_id: '', enrollment_id: '', subject: '', grade: '', semester: '', school_year: '', remarks: '' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('document_requests').insert({
        ...docForm, requested_at: new Date().toISOString(),
      })
      if (error) throw error
      await logAdminActivity('created', 'document_request', undefined, { doc_type: docForm.doc_type })
      addNotification({ type: 'success', title: 'Document request created' })
      setDocForm({ student_id: '', enrollment_id: '', student_name: '', doc_type: '', notes: '' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const updateDocStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('document_requests').update({ status, processed_at: status !== 'pending' ? new Date().toISOString() : null, processed_by: user?.id }).eq('id', id)
      if (error) throw error
      await logAdminActivity('updated', 'document_request', id, { status })
      addNotification({ type: 'success', title: 'Status updated' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  const tabs = [
    { key: 'enrollment' as const, label: 'Enrollment & ID Numbers' },
    { key: 'academic' as const, label: 'Academic Records' },
    { key: 'documents' as const, label: 'Document Requests' },
    { key: 'reports' as const, label: 'Reports' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Registrar Admin</h1>
          <p className="text-gray-500 text-sm">Student records, enrollment management, ID numbers, academic records, and reports.</p>
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

      {tab === 'enrollment' && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or parent..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Levels</option>
              <option value="kindergarten">Kindergarten</option>
              <option value="elementary">Elementary</option>
              <option value="junior-high">Junior High</option>
              <option value="senior-high">Senior High</option>
              <option value="college">College</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="enrolled">Enrolled</option>
            </select>
            <select value={claimFilter} onChange={(e) => setClaimFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Claims</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
            </select>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Level / Program</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ID Number</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Claim</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{e.first_name} {e.middle_name || ''} {e.last_name}</div>
                      <div className="text-xs text-gray-500">{e.parent_name} · {e.parent_email || e.parent_contact}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">{e.level}</span>
                      {(e.degree_program || e.grade_level) && <div className="text-[11px] text-gray-500 mt-0.5">{e.degree_program || e.grade_level}</div>}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-[#0B1F3A]">{e.id_number || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${e.student_id ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {e.student_id ? 'Claimed' : 'Unclaimed'}
                      </span>
                      {e.claimed_at && <div className="text-[10px] text-gray-400 mt-0.5">at {new Date(e.claimed_at).toLocaleString()}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <select value={e.status} onChange={(ev) => updateEnrollmentStatus(e.id, ev.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-700">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="enrolled">Enrolled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => loadDetail(e)} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium mr-2">View Details</button>
                      {e.id_number && !e.student_id && (
                        <button onClick={() => {
                          setConfirmState({ open: true, title: 'Regenerate ID Number', message: `Generate a new 6-digit ID for this unclaimed record? The old ID will be invalidated.`, onConfirm: () => { setConfirmState({ open: false, title: '', message: '', onConfirm: () => {} }); regenerateId(e.id) } })
                        }} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium mr-2">Regenerate ID</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'academic' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Academic Records ({academic.length})</h2>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Grade</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Semester / SY</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {academic.map((a) => {
                    const s = students.find((st) => st.id === a.student_id)
                    return (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-800">{s?.full_name || a.student_id}</td>
                        <td className="px-4 py-3 text-gray-700">{a.subject}</td>
                        <td className="px-4 py-3 font-semibold">{a.grade || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{a.semester} / {a.school_year}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm max-w-xs truncate">{a.remarks || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Add Academic Record</h2>
            <form onSubmit={addAcademicRecord} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={academicForm.student_id} onChange={(ev) => setAcademicForm({ ...academicForm, student_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]">
                  <option value="">Select student</option>
                  {students.map((st) => <option key={st.id} value={st.id}>{st.full_name || st.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Record (optional)</label>
                <select value={academicForm.enrollment_id} onChange={(ev) => setAcademicForm({ ...academicForm, enrollment_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]">
                  <option value="">—</option>
                  {enrollments.filter((e) => e.student_id).map((e) => (
                    <option key={e.id} value={e.id}>{`${e.first_name} ${e.last_name} (${e.id_number})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={academicForm.subject} onChange={(ev) => setAcademicForm({ ...academicForm, subject: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input value={academicForm.grade} onChange={(ev) => setAcademicForm({ ...academicForm, grade: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input value={academicForm.semester} onChange={(ev) => setAcademicForm({ ...academicForm, semester: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="1st Sem" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                  <input value={academicForm.school_year} onChange={(ev) => setAcademicForm({ ...academicForm, school_year: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="2025-2026" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input value={academicForm.remarks} onChange={(ev) => setAcademicForm({ ...academicForm, remarks: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Add Record</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Document Requests ({documents.length})</h2>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Document Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Requested</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => {
                    const s = students.find((st) => st.id === d.student_id)
                    return (
                      <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-800">{s?.full_name || d.student_name}</td>
                        <td className="px-4 py-3 text-gray-700">{d.doc_type}</td>
                        <td className="px-4 py-3">
                          <select value={d.status} onChange={(ev) => updateDocStatus(d.id, ev.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-700">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="released">Released</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(d.requested_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${d.status === 'ready' || d.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">New Document Request</h2>
            <form onSubmit={addDocument} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={docForm.student_id} onChange={(ev) => setDocForm({ ...docForm, student_id: ev.target.value, student_name: students.find(s => s.id === ev.target.value)?.full_name || '' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]">
                  <option value="">Select student</option>
                  {students.map((st) => <option key={st.id} value={st.id}>{st.full_name || st.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select value={docForm.doc_type} onChange={(ev) => setDocForm({ ...docForm, doc_type: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                  <option value="">Select type</option>
                  <option value="Form 137">Form 137 / Transcript</option>
                  <option value="Certificate of Enrollment">Certificate of Enrollment</option>
                  <option value="Certificate of Graduation">Certificate of Graduation</option>
                  <option value="Good Moral Certificate">Good Moral Certificate</option>
                  <option value="PSA Birth Certificate">PSA Birth Certificate</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={docForm.notes} onChange={(ev) => setDocForm({ ...docForm, notes: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} />
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <div className="text-3xl font-bold text-[#1E4E8C]">{enrollments.length}</div>
            <div className="text-sm text-gray-500">Total Enrollment Submissions</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <div className="text-3xl font-bold text-green-600">{enrollments.filter(e => e.student_id).length}</div>
            <div className="text-sm text-gray-500">Claimed (Active Students)</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <div className="text-3xl font-bold text-amber-600">{enrollments.filter(e => !e.student_id).length}</div>
            <div className="text-sm text-gray-500">Unclaimed (Pending Signup)</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <div className="text-3xl font-bold text-blue-600">{academic.length}</div>
            <div className="text-sm text-gray-500">Academic Records</div>
          </div>
        </div>
      )}

      {detailView && (
        <DetailViewModal
          enrollment={detailView}
          loading={detailLoading}
          academic={detailAcademic}
          documents={detailDocuments}
          billing={detailBilling}
          payments={detailPayments}
          onClose={() => setDetailView(null)}
        />
      )}

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ open: false, title: '', message: '', onConfirm: () => {} })}
      />
    </div>
  )
}

function DetailViewModal({ enrollment, loading, academic, documents, billing, payments, onClose }: {
  enrollment: EnrollmentRow
  loading: boolean
  academic: AcademicRecord[]
  documents: DocumentRequest[]
  billing: BillingAccount[]
  payments: Payment[]
  onClose: () => void
}) {
  const fullName = `${enrollment.first_name} ${enrollment.middle_name || ''} ${enrollment.last_name}`.trim()
  const isClaimed = !!enrollment.student_id

  useEffect(() => {
    if (loading) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [loading])

  if (!enrollment) return null

  const requirementLabels: Record<string, string> = {
    birthCert: 'PSA Birth Certificate',
    Form137: 'Form 137 / Transcript',
    goodMoral: 'Good Moral Character Certificate',
    medicalCert: 'Medical Certificate',
    idPhotos: '2x2 ID Photos (4 copies)',
    shsDiploma: 'SHS Diploma / Certificate of Graduation',
    ncaeResult: 'NCAE Result',
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(11, 31, 58, 0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" style={{ animation: 'modalIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F3A]">{fullName}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">{enrollment.level}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isClaimed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isClaimed ? 'Claimed' : 'Unclaimed'}
              </span>
              <span className="text-gray-500">ID: {enrollment.id_number || '—'}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
          ) : (
            <>
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Student Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 block">ID Number</span><span className="font-mono font-bold text-[#0B1F3A] text-lg">{enrollment.id_number || '—'}</span></div>
                  <div><span className="text-gray-500 block">Level</span><span className="font-medium">{enrollment.level}</span></div>
                  <div><span className="text-gray-500 block">Status</span><span className="font-medium capitalize">{enrollment.status}</span></div>
                  <div><span className="text-gray-500 block">Claimed</span><span className="font-medium">{isClaimed ? 'Yes' : 'No'}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500 block">Full Name</span><span className="font-medium text-lg">{fullName}</span></div>
                  <div><span className="text-gray-500 block">Age</span><span className="font-medium">{enrollment.age || '—'}</span></div>
                  <div><span className="text-gray-500 block">Date of Birth</span><span className="font-medium">{enrollment.dob ? new Date(enrollment.dob).toLocaleDateString() : '—'}</span></div>
                  <div><span className="text-gray-500 block">Gender</span><span className="font-medium capitalize">{enrollment.gender || '—'}</span></div>
                  <div><span className="text-gray-500 block">Civil Status</span><span className="font-medium capitalize">{enrollment.civil_status || '—'}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500 block">Address</span><span className="font-medium">{enrollment.address}</span></div>
                </div>
              </div>

              {/* Parent/Guardian */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> Parent / Guardian</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="md:col-span-2"><span className="text-gray-500 block">Name</span><span className="font-medium">{enrollment.parent_name}</span></div>
                  <div><span className="text-gray-500 block">Contact</span><span className="font-medium">{enrollment.parent_contact}</span></div>
                  <div><span className="text-gray-500 block">Email</span><span className="font-medium">{enrollment.parent_email || '—'}</span></div>
                  <div><span className="text-gray-500 block">Occupation</span><span className="font-medium">{enrollment.parent_occupation || '—'}</span></div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg> Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Contact Person</span><span className="font-medium">{enrollment.emergency_contact}</span></div>
                  <div><span className="text-gray-500 block">Phone</span><span className="font-medium">{enrollment.emergency_phone}</span></div>
                </div>
              </div>

              {/* Academic Background */}
              {(enrollment.level === 'college' || enrollment.level === 'senior-high') && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> Academic Background</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="md:col-span-2"><span className="text-gray-500 block">{enrollment.level === 'college' ? 'Degree Program' : 'Strand'}</span><span className="font-medium">{enrollment.degree_program || enrollment.grade_level || '—'}</span></div>
                    <div><span className="text-gray-500 block">High School</span><span className="font-medium">{enrollment.high_school || '—'}</span></div>
                    <div><span className="text-gray-500 block">Year Graduated</span><span className="font-medium">{enrollment.year_graduated || '—'}</span></div>
                    <div><span className="text-gray-500 block">LRN</span><span className="font-mono text-sm">{enrollment.lrn || '—'}</span></div>
                  </div>
                </div>
              )}

              {/* Requirements Checklist */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Requirements Checklist</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(enrollment.requirements || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${value ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                        {value && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      </div>
                      <span className="text-sm text-gray-700">{requirementLabels[key] || key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Records */}
              {academic.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl">
                  <h3 className="font-bold text-[#0B1F3A] p-5 border-b border-gray-200 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Academic Records ({academic.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50"><tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Grade</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Semester / SY</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Remarks</th>
                      </tr></thead>
                      <tbody>
                        {academic.map(a => (
                          <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{a.subject}</td>
                            <td className="px-4 py-3 font-semibold">{a.grade || '—'}</td>
                            <td className="px-4 py-3 text-gray-600">{a.semester} / {a.school_year}</td>
                            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{a.remarks || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Document Requests */}
              {documents.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl">
                  <h3 className="font-bold text-[#0B1F3A] p-5 border-b border-gray-200 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Document Requests ({documents.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50"><tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Document Type</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Requested</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Processed</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                      </tr></thead>
                      <tbody>
                        {documents.map(d => (
                          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{d.doc_type}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${d.status === 'ready' || d.status === 'released' ? 'bg-green-100 text-green-700' : d.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{d.status}</span></td>
                            <td className="px-4 py-3 text-gray-500">{new Date(d.requested_at).toLocaleString()}</td>
                            <td className="px-4 py-3 text-gray-500">{d.processed_at ? new Date(d.processed_at).toLocaleString() : '—'}</td>
                            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{d.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Billing & Payments */}
              {(billing.length > 0 || payments.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-xl">
                  <h3 className="font-bold text-[#0B1F3A] p-5 border-b border-gray-200 flex items-center gap-2"><svg className="w-5 h-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.759 1.117l-.845.845A4.978 4.978 0 0012 9c-1.11 0-2.08.402-2.759 1.117l.845.845A5.964 5.964 0 0112 7a6 6 0 016 6h.75a1.5 1.5 0 010 3H6a1.5 1.5 0 010-3h.75A6 6 0 0112 7z" /></svg> Billing & Payments</h3>
                  <div className="p-5 space-y-6">
                    {billing.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Billing Accounts</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">School Year / Sem</th>
                              <th className="text-right px-4 py-3 font-medium text-gray-600">Total Due</th>
                              <th className="text-right px-4 py-3 font-medium text-gray-600">Balance</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                            </tr></thead>
                            <tbody>
                              {billing.map(b => {
                                const statusColors: Record<string, string> = {
                                  paid: 'bg-green-100 text-green-700',
                                  pending: 'bg-amber-100 text-amber-700',
                                  partial: 'bg-blue-100 text-blue-700',
                                  overdue: 'bg-red-100 text-red-700',
                                }
                                return (
                                  <tr key={b.id} className="border-b border-gray-100">
                                    <td className="px-4 py-3">{b.school_year} / {b.semester}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-[#0B1F3A]">₱{b.total_due.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-red-600">₱{b.balance.toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>{b.status}</span></td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {payments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Payments</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Method</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-600">Verified</th>
                            </tr></thead>
                            <tbody>
                              {payments.map(p => (
                                <tr key={p.id} className="border-b border-gray-100">
                                  <td className="px-4 py-3 font-semibold text-[#0B1F3A]">₱{p.amount.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-gray-600 capitalize">{p.method}</td>
                                  <td className="px-4 py-3 text-gray-500">{p.reference_no || '—'}</td>
                                  <td className="px-4 py-3 text-gray-500">{new Date(p.paid_at).toLocaleString()}</td>
                                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.verified ? 'Verified' : 'Pending'}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submission Info */}
              <div className="bg-gray-50 rounded-xl p-5 border-t-4 border-[#1E4E8C]">
                <h3 className="font-bold text-[#0B1F3A] mb-3">Submission Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Submitted</span><span className="font-medium">{new Date(enrollment.created_at).toLocaleString()}</span></div>
                  <div><span className="text-gray-500 block">Enrollment ID</span><span className="font-mono text-sm">{enrollment.id}</span></div>
                  {isClaimed && (
                    <>
                      <div><span className="text-gray-500 block">Claimed At</span><span className="font-medium">{enrollment.claimed_at ? new Date(enrollment.claimed_at).toLocaleString() : '—'}</span></div>
                      <div><span className="text-gray-500 block">User ID</span><span className="font-mono text-sm">{enrollment.student_id}</span></div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}