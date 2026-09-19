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
  parent_name: string; parent_email: string; parent_contact: string;
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
      const { data: rec, error } = await supabase.from('academic_records').insert({
        ...academicForm, created_by: user?.id,
      }).select().single()
      if (error) throw error
      await logAdminActivity('created', 'academic_record', rec?.id ?? null, { subject: academicForm.subject })
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
      const { data: doc, error } = await supabase.from('document_requests').insert({
        ...docForm, requested_at: new Date().toISOString(),
      }).select().single()
      if (error) throw error
      await logAdminActivity('created', 'document_request', doc?.id ?? null, { doc_type: docForm.doc_type })
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
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
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
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
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