import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'

interface ScheduleRow {
  class_id: string
  code: string
  title: string
  section: string
  days: string[]
  time: string | null
  room: string | null
  units: number | null
  instructor: string
  semester: string | null
  school_year: string | null
}

interface EnrollmentInfo {
  id_number: string | null
  level: string
  degree_program: string | null
  grade_level: string | null
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_ABBR: Record<string, string> = { monday: 'M', tuesday: 'T', wednesday: 'W', thursday: 'TH', friday: 'F', saturday: 'Sat', sunday: 'Su' }

function parseDays(raw: string | null): string[] {
  if (!raw) return []
  const lower = raw.toLowerCase()
  const days = new Set<string>()
  const names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  names.forEach(n => { if (lower.includes(n)) days.add(n) })
  if (days.size === 0) {
    if (/\bth\b|thu/.test(lower)) days.add('thursday')
    if (/\bm\b|mon/.test(lower)) days.add('monday')
    if (/\bt\b|tue/.test(lower)) days.add('tuesday')
    if (/\bw\b|wed/.test(lower)) days.add('wednesday')
    if (/\bf\b|fri/.test(lower)) days.add('friday')
    if (/\bsa?\b|sat/.test(lower)) days.add('saturday')
    if (/\bsu\b|sun/.test(lower)) days.add('sunday')
  }
  return DAY_ORDER.filter(d => days.has(d))
}

function dayGroup(days: string[]): 'blue' | 'green' | 'orange' {
  if (days.includes('monday') && days.includes('wednesday')) return 'blue'
  if (days.includes('tuesday') && days.includes('thursday')) return 'green'
  if (days.includes('friday') || days.includes('saturday')) return 'orange'
  return 'blue'
}

function parseTimeRange(raw: string | null): { start: number; end: number; hours: number } | null {
  if (!raw) return null
  const parts = raw.split('-')
  if (parts.length !== 2) return null
  const toMinutes = (s: string): number | null => {
    const t = s.trim().toUpperCase().replace('NN', 'PM')
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/)
    if (!m) return null
    let h = parseInt(m[1])
    const min = parseInt(m[2])
    const ap = m[3]
    if (ap === 'PM' && h !== 12) h += 12
    if (ap === 'AM' && h === 12) h = 0
    return h * 60 + min
  }
  const start = toMinutes(parts[0])
  const end = toMinutes(parts[1])
  if (start === null || end === null || end <= start) return null
  return { start, end, hours: (end - start) / 60 }
}

function fmtHours(h: number) {
  return h.toFixed(1).replace(/\.0$/, '') || '0'
}

const groupLabel: Record<string, string> = { blue: 'MW', green: 'TTh', orange: 'Fri-Sat' }

export function Schedule() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const [rows, setRows] = useState<ScheduleRow[]>([])
  const [enrollment, setEnrollment] = useState<EnrollmentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [semFilter, setSemFilter] = useState('all')
  const [semOpen, setSemOpen] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    ;(async () => {
      const { data } = await supabase
        .from('class_rosters')
        .select('*, classes(*)')
        .eq('student_id', user.id)
        .eq('status', 'enrolled')

      const aids = [...new Set((data || []).map(r => r.classes?.adviser_id).filter(Boolean))] as string[]
      let tm: Record<string, string> = {}
      if (aids.length) {
        const { data: p } = await supabase.from('profiles').select('id, full_name').in('id', aids)
        p?.forEach(x => { tm[x.id] = x.full_name })
      }

      setRows((data || []).map(r => ({
        class_id: r.class_id,
        code: r.classes?.name ?? '—',
        title: r.classes?.subject ?? '',
        section: r.classes?.section ?? '',
        days: parseDays(r.classes?.schedule_day ?? null),
        time: r.classes?.schedule_time ?? null,
        room: r.classes?.room ?? null,
        units: r.classes?.units ?? null,
        instructor: r.classes?.adviser_id ? (tm[r.classes.adviser_id] ?? '—') : '—',
        semester: r.classes?.semester ?? null,
        school_year: r.classes?.school_year ?? null,
      })).sort((a, b) => {
        const da = a.days[0] ? DAY_ORDER.indexOf(a.days[0]) : 9
        const db = b.days[0] ? DAY_ORDER.indexOf(b.days[0]) : 9
        if (da !== db) return da - db
        return (a.time || '').localeCompare(b.time || '')
      }))

      const { data: enr } = await supabase
        .from('enrollment_submissions')
        .select('id_number, level, degree_program, grade_level')
        .eq('student_id', user.id)
        .order('claimed_at', { ascending: false })
        .limit(1)
      if (enr?.[0]) setEnrollment(enr[0])

      setLoading(false)
    })()
  }, [user?.id])

  const semesters = useMemo(() => {
    const set = new Set(rows.map(r => `${r.semester || ''}|${r.school_year || ''}`))
    return Array.from(set).map(s => {
      const [sem, sy] = s.split('|')
      return { value: s, label: `${sem || 'All'}${sy ? ` - ${sy.split('-').map(y => y.slice(2)).join('–')}` : ''}` }
    }).filter(s => s.value !== '|')
  }, [rows])

  const filtered = semFilter === 'all' ? rows : rows.filter(r => `${r.semester || ''}|${r.school_year || ''}` === semFilter)

  const summary = useMemo(() => {
    const subjects = filtered.length
    const totalUnits = filtered.reduce((s, r) => s + (r.units ?? 0), 0)
    let weeklyHours = 0
    filtered.forEach(r => {
      const t = parseTimeRange(r.time)
      if (t) weeklyHours += t.hours * Math.max(1, r.days.length)
    })
    const allDays = new Set<string>()
    filtered.forEach(r => r.days.forEach(d => allDays.add(d)))
    const dayCount = allDays.size
    const groups = [...new Set(filtered.map(r => dayGroup(r.days)))]
    const groupText = groups.map(g => groupLabel[g]).join(', ')
    return { subjects, totalUnits, weeklyHours, dayCount, groupText }
  }, [filtered])

  const conflicts = useMemo(() => {
    const list: string[] = []
    for (let i = 0; i < filtered.length; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        const a = filtered[i]
        const b = filtered[j]
        const ta = parseTimeRange(a.time)
        const tb = parseTimeRange(b.time)
        if (!ta || !tb) continue
        const shared = a.days.some(d => b.days.includes(d))
        if (shared && ta.start < tb.end && tb.start < ta.end) {
          list.push(`${a.code} & ${b.code}`)
        }
      }
    }
    return list
  }, [filtered])

  const academicYear = enrollment
    ? `Academic Year ${rows[0]?.school_year ?? '2026–2027'} • ${rows[0]?.semester ?? '1st Semester'} • ${enrollment.degree_program || enrollment.level}`
    : 'Academic Year 2026–2027 • 1st Semester'

  const academicYearDisplay = academicYear.replace(/(\d{4})-(\d{4})/, '$1–$2')

  return (
    <StudentLayout title="Class Schedule">
      <div className="max-w-[1400px] mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between gap-5 mb-[18px] flex-wrap">
          <div>
            <p className="text-[#4269CF] text-[9.5px] font-bold tracking-[0.45px] mb-1.5">ACADEMIC RECORDS & TIMETABLE</p>
            <h1 className="text-[22px] font-bold text-[#1F2E47] m-0 mb-1.5 leading-[1.1]">Class Schedule</h1>
            <p className="text-[10px] text-[#7E899B] leading-[1.4] m-0">{academicYearDisplay}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button onClick={() => setSemOpen(!semOpen)} aria-label="Filter by semester"
                className="h-8 px-3 bg-white border border-[#DCE2EA] rounded-md text-[10px] text-[#4F5D73] flex items-center gap-3 hover:bg-[#F8FAFF] transition-colors">
                {semFilter === 'all' ? (semesters[0]?.label || 'All Semesters') : semesters.find(s => s.value === semFilter)?.label}
                <span className="text-[8px]">⌄</span>
              </button>
              {semOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setSemOpen(false)} />
                  <div className="absolute right-0 top-9 bg-white border border-[#E3E8EF] rounded-md shadow-[0_8px_24px_rgba(15,42,92,0.14)] min-w-[160px] overflow-hidden z-30">
                    <button onClick={() => { setSemFilter('all'); setSemOpen(false) }}
                      className="block w-full text-left px-3 py-2 text-[10px] text-[#4F5D73] hover:bg-[#F1F5FD]">All Semesters</button>
                    {semesters.map(s => (
                      <button key={s.value} onClick={() => { setSemFilter(s.value); setSemOpen(false) }}
                        className={`block w-full text-left px-3 py-2 text-[10px] hover:bg-[#F1F5FD] ${semFilter === s.value ? 'bg-[#EDF2FF] text-[#315FC5]' : 'text-[#4F5D73]'}`}>{s.label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => window.print()} aria-label="Print schedule"
              className="h-8 px-3 bg-white border border-[#DCE2EA] rounded-md text-[10px] text-[#4F5D73] flex items-center gap-1.5 hover:bg-[#F8FAFF] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="6 9 6 2 18 9 18 9 6 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Schedule (PDF)
            </button>
          </div>
        </div>

        {/* Summary grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3.5">
          {[
            {
              icon: 'book', color: 'bg-[#EDF2FF] text-[#416DE0]',
              label: 'ENROLLED COURSES',
              value: `${summary.subjects} Subject${summary.subjects !== 1 ? 's' : ''}`,
              sub: `${summary.totalUnits.toFixed(1).replace(/\.0$/, '')} Academic Unit${summary.totalUnits !== 1 ? 's' : ''}`,
            },
            {
              icon: 'clock', color: 'bg-[#EDF2FF] text-[#416DE0]',
              label: 'WEEKLY HOURS',
              value: summary.weeklyHours > 0 ? `${fmtHours(summary.weeklyHours)} Hours` : '—',
              sub: 'Lecture & Laboratory',
            },
            {
              icon: 'check', color: 'bg-[#EAFAF3] text-[#19A873]',
              label: 'SCHEDULE STATUS',
              value: 'Official / Enrolled',
              valueCls: 'text-[#15A66C]',
              sub: 'Registrar Validated',
            },
            {
              icon: 'range', color: 'bg-[#F3EFFF] text-[#7652DC]',
              label: 'DAYS ACTIVE',
              value: summary.dayCount > 0 ? `${summary.dayCount} Day${summary.dayCount !== 1 ? 's' : ''} / Week` : '—',
              sub: summary.groupText || 'No schedule',
            },
          ].map(c => (
            <div key={c.label} className="min-h-[76px] px-3.5 py-3 bg-white border border-[#E3E8EF] rounded-lg flex items-center gap-[11px] shadow-[0_1px_2px_rgba(25,45,75,0.03)]">
              <div className={`w-[31px] h-[31px] rounded-md flex items-center justify-center shrink-0 ${c.color}`}>
                {c.icon === 'book' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>}
                {c.icon === 'clock' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                {c.icon === 'check' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                {c.icon === 'range' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              </div>
              <div className="min-w-0">
                <p className="text-[7.5px] font-bold text-[#8994A6] tracking-[0.2px] m-0 mb-0.5">{c.label}</p>
                <h2 className={`text-[12.5px] font-bold leading-[1.2] m-0 mb-0.5 truncate ${c.valueCls || 'text-[#27344D]'}`}>{c.value}</h2>
                <span className="text-[8.5px] text-[#8994A6] leading-[1.2] truncate block">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule table */}
        <div className="w-full bg-white border border-[#E1E6ED] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(30,50,80,0.025)]">
          <div className="min-h-[57px] px-4 py-3 border-b border-[#E8EDF2] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[11px] font-bold text-[#263650] m-0 mb-1">Class Schedule & Registered Subjects Breakdown</h2>
              <p className="text-[9px] text-[#8994A5] leading-[1.3] m-0">Master official course schedule, classroom assignments, and academic timetable</p>
            </div>
            <span className="px-2 py-1 bg-[#EAFAF3] border border-[#B9EFD5] rounded-full text-[8px] font-semibold text-[#13A66B] whitespace-nowrap">
              ✓ All {summary.subjects} Course Sets Confirmed
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px]" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead className="bg-[#FBFCFE]">
                <tr>
                  {['SUBJECT CODE', 'DESCRIPTIVE TITLE', 'DAY(S)', 'TIME', 'ROOM / LAB', 'UNITS', 'INSTRUCTOR', 'STATUS'].map((h, i) => (
                    <th key={h} className="px-[11px] py-[9px] border-b border-[#E7ECF2] text-left text-[7.5px] font-semibold text-[#8994A6] leading-[1.3]"
                      style={{ width: ['13%', '17%', '14%', '12%', '8%', '7%', '15%', '9%'][i] }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-[11px] text-[#8994A6]">Loading schedule...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-[11px] text-[#8994A6]">No classes scheduled. Classes added by your teachers or the school admin will show up here.</td></tr>
                ) : filtered.map(r => {
                  const g = dayGroup(r.days)
                  const dotCls = g === 'blue' ? 'bg-[#2865EF]' : g === 'green' ? 'bg-[#19AC72]' : 'bg-[#F0A01C]'
                  const dayCls = g === 'blue' ? 'bg-[#EDF3FF] text-[#3865C9]' : g === 'green' ? 'bg-[#EAFAF2] text-[#16965F]' : 'bg-[#FFF5E6] text-[#D87B12]'
                  return (
                    <tr key={r.class_id} className="hover:bg-[#FAFCFF]">
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle">
                        <span className={`inline-block w-[5px] h-[5px] rounded-full mr-1 ${dotCls}`} />
                        <strong className="text-[#2F5FC2] text-[8.5px] font-bold">{r.code}</strong>
                        {r.section && <div className="text-[8px] text-[#8994A6] mt-0.5">{r.section}</div>}
                      </td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle text-[8.5px] text-[#56647A] leading-[1.35]">{r.title || '—'}</td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle">
                        <span className={`inline-block px-1.5 py-1 rounded text-[7.5px] leading-[1.35] ${dayCls}`}>
                          {r.days.length > 0 ? r.days.map(d => DAY_ABBR[d]).join(' & ') : '—'}
                        </span>
                      </td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle">
                        <strong className="text-[#3D4B61] text-[8.5px] font-bold">{r.time || '—'}</strong>
                      </td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle text-[8.5px] text-[#56647A]">{r.room || '—'}</td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle text-[8.5px] text-[#56647A]">{r.units !== null ? r.units.toFixed(1) : '—'}</td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle text-[8.5px] text-[#56647A] leading-[1.35]">{r.instructor}</td>
                      <td className="px-[11px] py-2.5 border-b border-[#EDF0F4] align-middle">
                        <span className="inline-block px-1.5 py-[3px] rounded-sm bg-[#EAFAF3] border border-[#B9EFD5] text-[#12A46B] text-[6.5px] font-bold tracking-[0.1px]">ENROLLED</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="min-h-[39px] px-4 py-2.5 border-t border-[#EDF0F4] flex items-center gap-6 flex-wrap text-[8px] text-[#8994A5]">
            <span>TOTAL REGISTERED LOAD: <strong className="text-[#315FC2] font-semibold">{summary.subjects} Subject{summary.subjects !== 1 ? 's' : ''}{summary.groupText ? ` Across ${summary.groupText}` : ''}</strong></span>
            <strong className="ml-auto text-center text-[#315FC2] text-[9.5px] leading-[1.15]">{summary.totalUnits.toFixed(1)}<br />Units</strong>
            <span className="whitespace-nowrap">Registrar Verified • Official Record</span>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2.5 mt-3">
          <div className="min-h-[66px] bg-white border border-[#E1E7EF] rounded-md px-3.5 py-3 flex items-start gap-2.5">
            <div className="w-[25px] h-[25px] rounded-full bg-[#EEF3FF] text-[#4D6ED1] flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h3 className="text-[9.5px] font-bold text-[#43516A] m-0 mb-1">Class Attendance Policy</h3>
              <p className="text-[8.5px] text-[#7F8B9E] leading-[1.5] m-0">
                Regular class attendance is monitored by respective course instructors.
                Please refer to course syllabi for specific attendance rules,
                consultation hours, and academic policies.
              </p>
            </div>
          </div>

          <div className="min-h-[66px] bg-white border border-[#E1E7EF] rounded-md px-3.5 py-3 flex flex-col justify-center">
            <p className="text-[7.5px] font-semibold text-[#8994A6] m-0 mb-1">CONFLICT CHECK</p>
            {conflicts.length === 0 ? (
              <strong className="text-[#15A66C] text-[9.5px] font-bold m-0 mb-1">✓ Zero Schedule Overlaps</strong>
            ) : (
              <strong className="text-[#E4483F] text-[9.5px] font-bold m-0 mb-1">{conflicts.length} Overlap{conflicts.length !== 1 ? 's' : ''}: {conflicts.slice(0, 2).join(', ')}{conflicts.length > 2 ? '…' : ''}</strong>
            )}
            <button onClick={() => navigate('/appointments')} className="text-left text-[#4168C8] text-[8.5px] bg-transparent border-none cursor-pointer p-0 hover:underline">
              Request Room Change →
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default Schedule
