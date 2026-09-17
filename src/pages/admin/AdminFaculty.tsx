import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import ConfirmModal from '../../components/ConfirmModal'

interface Class {
  id: string; name: string; subject: string; section: string;
  adviser_id: string | null; room: string; schedule_day: string;
  schedule_time: string; school_year: string; semester: string;
}

interface ClassRoster {
  id: string; class_id: string; student_id: string; student_name: string; status: string; enrolled_at: string;
}

interface Grade { id: string; class_id: string; student_id: string; grade: number | null; remarks: string; }
interface Attendance { id: string; class_id: string; student_id: string; att_date: string; status: string; }

interface StudentRow { id: string; email: string | null; full_name: string | null; }
interface AdviserRow { id: string; full_name: string | null; }

export default function AdminFaculty() {
  const [tab, setTab] = useState<'classes' | 'rosters' | 'grades' | 'attendance'>('classes')
  const [classes, setClasses] = useState<Class[]>([])
  const [rosters, setRosters] = useState<ClassRoster[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [advisers, setAdvisers] = useState<AdviserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [classForm, setClassForm] = useState({ name: '', subject: '', section: '', adviser_id: '', room: '', schedule_day: '', schedule_time: '', school_year: '', semester: '' })
  const [rosterForm, setRosterForm] = useState({ class_id: '', student_id: '', student_name: '' })
  const [gradeForm, setGradeForm] = useState({ class_id: '', student_id: '', grade: '', remarks: '' })
  const [attForm, setAttForm] = useState({ class_id: '', student_id: '', att_date: '', status: 'present' })
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => {} })
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { user } = useAuthStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [clsRes, rosRes, grdRes, attRes, stuRes, advRes] = await Promise.all([
        supabase.from('classes').select('*').order('created_at', { ascending: false }),
        supabase.from('class_rosters').select('*').order('enrolled_at', { ascending: false }),
        supabase.from('grades').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance').select('*').order('att_date', { ascending: false }),
        supabase.from('profiles').select('id, email, full_name, role').eq('role', 'student'),
        supabase.from('profiles').select('id, full_name').in('role', ['faculty', 'super_admin', 'admin', 'registrar', 'edp', 'accounting', 'other_admin']),
      ])
      if (clsRes.error) throw clsRes.error
      if (rosRes.error) throw rosRes.error
      if (grdRes.error) throw grdRes.error
      if (attRes.error) throw attRes.error
      if (stuRes.error) throw stuRes.error
      if (advRes.error) throw advRes.error
      setClasses(clsRes.data || [])
      setRosters(rosRes.data || [])
      setGrades(grdRes.data || [])
      setAttendance(attRes.data || [])
      setStudents(stuRes.data || [])
      setAdvisers(advRes.data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => { load() }, [load])

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('classes').insert({ ...classForm })
      if (error) throw error
      await logAdminActivity('created', 'class', undefined, { name: classForm.name })
      addNotification({ type: 'success', title: 'Class created' })
      setClassForm({ name: '', subject: '', section: '', adviser_id: '', room: '', schedule_day: '', schedule_time: '', school_year: '', semester: '' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addRoster = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('class_rosters').insert({ ...rosterForm, class_id: selectedClass?.id || rosterForm.class_id })
      if (error) throw error
      await logAdminActivity('enrolled', 'student', rosterForm.student_id, { class: selectedClass?.name })
      addNotification({ type: 'success', title: 'Student added to class' })
      setRosterForm({ class_id: '', student_id: '', student_name: '' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('grades').upsert({ ...gradeForm, class_id: selectedClass?.id || gradeForm.class_id, encoded_by: user?.id }, { onConflict: 'class_id,student_id' })
      if (error) throw error
      await logAdminActivity('graded', 'student', gradeForm.student_id, { class: selectedClass?.name, grade: gradeForm.grade })
      addNotification({ type: 'success', title: 'Grade saved' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('attendance').upsert({ ...attForm, class_id: selectedClass?.id || attForm.class_id, recorded_by: user?.id }, { onConflict: 'class_id,student_id,att_date' })
      if (error) throw error
      await logAdminActivity('attendance', 'student', attForm.student_id, { class: selectedClass?.name, date: attForm.att_date, status: attForm.status })
      addNotification({ type: 'success', title: 'Attendance recorded' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to record', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  const tabs = [
    { key: 'classes' as const, label: 'Classes & Schedules' },
    { key: 'rosters' as const, label: 'Rosters' },
    { key: 'grades' as const, label: 'Grades' },
    { key: 'attendance' as const, label: 'Attendance' },
  ]

  const getAdviser = (id: string | null) => advisers.find(a => a.id === id)
  const getStudent = (id: string | null) => students.find(s => s.id === id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Faculty Admin</h1>
          <p className="text-gray-500 text-sm">Classes, student lists, grades, attendance, and schedules.</p>
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

      {tab === 'classes' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Classes ({classes.length})</h2>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Class / Subject</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Section</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Adviser</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Room</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Schedule</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">SY / Sem</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Roster</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => {
                    const a = getAdviser(c.adviser_id)
                    const rosterCount = rosters.filter(r => r.class_id === c.id).length
                    return (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.subject || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{c.section}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{a?.full_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{c.room || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{c.schedule_day} {c.schedule_time}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{c.school_year} / {c.semester}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => { setSelectedClass(c); setTab('rosters') }} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium">{rosterCount} student{rosterCount !== 1 ? 's' : ''}</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Create Class</h2>
            <form onSubmit={addClass} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input value={classForm.name} onChange={(ev) => setClassForm({ ...classForm, name: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required placeholder="e.g. BSIT 1A - Programming 1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input value={classForm.subject} onChange={(ev) => setClassForm({ ...classForm, subject: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Programming 1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input value={classForm.section} onChange={(ev) => setClassForm({ ...classForm, section: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="BSIT-1A" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adviser</label>
                  <select value={classForm.adviser_id} onChange={(ev) => setClassForm({ ...classForm, adviser_id: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">None</option>
                    {advisers.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <input value={classForm.room} onChange={(ev) => setClassForm({ ...classForm, room: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Room 201" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select value={classForm.schedule_day} onChange={(ev) => setClassForm({ ...classForm, schedule_day: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">—</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input value={classForm.schedule_time} onChange={(ev) => setClassForm({ ...classForm, schedule_time: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="7:00 AM - 9:00 AM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                  <input value={classForm.school_year} onChange={(ev) => setClassForm({ ...classForm, school_year: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="2025-2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select value={classForm.semester} onChange={(ev) => setClassForm({ ...classForm, semester: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">—</option>
                    <option value="1st Sem">1st Sem</option>
                    <option value="2nd Sem">2nd Sem</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Create Class</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'rosters' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Class Rosters {selectedClass ? `— ${selectedClass.name}` : ''} ({rosters.filter(r => r.class_id === selectedClass?.id).length})</h2>
            {selectedClass ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Enrolled</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosters.filter(r => r.class_id === selectedClass?.id).map((r) => {
                      const s = getStudent(r.student_id)
                      return (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-800">{s?.full_name || r.student_name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${r.status === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.enrolled_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setConfirmState({ open: true, title: 'Remove Student', message: `Remove ${s?.full_name || r.student_name} from this class?`, onConfirm: async () => { await supabase.from('class_rosters').delete().eq('id', r.id); await logAdminActivity('removed', 'roster', r.id); addNotification({ type: 'success', title: 'Removed' }); load() } }) }} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center text-gray-500 border border-[rgba(11,31,58,0.08)]">
                Select a class from the Classes tab to manage its roster.
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Add Student to Class</h2>
            <form onSubmit={addRoster} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select value={rosterForm.class_id} onChange={(ev) => setRosterForm({ ...rosterForm, class_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={rosterForm.student_id} onChange={(ev) => {
                  const st = students.find(s => s.id === ev.target.value)
                  setRosterForm({ ...rosterForm, student_id: ev.target.value, student_name: st?.full_name || '' })
                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select student</option>
                  {students.map((st) => <option key={st.id} value={st.id}>{st.full_name || st.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name (auto-filled)</label>
                <input value={rosterForm.student_name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50" readOnly />
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Add to Roster</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'grades' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Grades {selectedClass ? `— ${selectedClass.name}` : ''} ({grades.filter(g => g.class_id === selectedClass?.id).length})</h2>
            {selectedClass ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Grade</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Remarks</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.filter(g => g.class_id === selectedClass?.id).map((g) => {
                      const s = getStudent(g.student_id)
                      return (
                        <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-800">{s?.full_name || g.student_id}</td>
                          <td className="px-4 py-3 text-right font-bold text-lg">{g.grade !== null ? g.grade : <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3 text-gray-500 text-sm max-w-xs truncate">{g.remarks || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setGradeForm({ ...gradeForm, class_id: g.class_id, student_id: g.student_id, grade: g.grade?.toString() || '', remarks: g.remarks }); setSelectedClass(classes.find(c => c.id === g.class_id) ?? null) }} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium">Edit</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center text-gray-500 border border-[rgba(11,31,58,0.08)]">
                Select a class from the Classes tab to manage grades.
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Add / Edit Grade</h2>
            <form onSubmit={addGrade} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select value={gradeForm.class_id} onChange={(ev) => { setGradeForm({ ...gradeForm, class_id: ev.target.value }); setSelectedClass(classes.find(c => c.id === ev.target.value) ?? null) }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={gradeForm.student_id} onChange={(ev) => setGradeForm({ ...gradeForm, student_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select student</option>
                  {rosters.filter(r => r.class_id === selectedClass?.id).map((r) => {
                    const s = getStudent(r.student_id)
                    return <option key={r.student_id} value={r.student_id}>{s?.full_name || r.student_name}</option>
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input type="number" step="0.01" min="0" max="100" value={gradeForm.grade} onChange={(ev) => setGradeForm({ ...gradeForm, grade: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 92.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input value={gradeForm.remarks} onChange={(ev) => setGradeForm({ ...gradeForm, remarks: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Pass / Needs improvement" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Save Grade</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'attendance' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Attendance {selectedClass ? `— ${selectedClass.name}` : ''} ({attendance.filter(a => a.class_id === selectedClass?.id).length})</h2>
            {selectedClass ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.filter(a => a.class_id === selectedClass?.id).map((a) => {
                      const s = getStudent(a.student_id)
                      const statusColors: Record<string, string> = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-amber-100 text-amber-700', excused: 'bg-blue-100 text-blue-700' }
                      return (
                        <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-800">{s?.full_name || a.student_id}</td>
                          <td className="px-4 py-3 text-gray-600">{new Date(a.att_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setAttForm({ ...attForm, class_id: a.class_id, student_id: a.student_id, att_date: a.att_date, status: a.status }); setSelectedClass(classes.find(c => c.id === a.class_id) ?? null) }} className="text-[#1E4E8C] hover:text-[#0B1F3A] text-xs font-medium">Edit</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center text-gray-500 border border-[rgba(11,31,58,0.08)]">
                Select a class from the Classes tab to manage attendance.
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Record Attendance</h2>
            <form onSubmit={addAttendance} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select value={attForm.class_id} onChange={(ev) => { setAttForm({ ...attForm, class_id: ev.target.value }); setSelectedClass(classes.find(c => c.id === ev.target.value) ?? null) }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={attForm.student_id} onChange={(ev) => setAttForm({ ...attForm, student_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select student</option>
                  {rosters.filter(r => r.class_id === selectedClass?.id).map((r) => {
                    const s = getStudent(r.student_id)
                    return <option key={r.student_id} value={r.student_id}>{s?.full_name || r.student_name}</option>
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={attForm.att_date} onChange={(ev) => setAttForm({ ...attForm, att_date: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={attForm.status} onChange={(ev) => setAttForm({ ...attForm, status: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Record Attendance</button>
            </form>
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