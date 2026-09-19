import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotification } from '../hooks/useNotification'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'
import ConfirmModal from '../components/ConfirmModal'
import {
  Search, Pencil, Copy, MoreHorizontal, FileText,
  CheckCircle, AlignJustify, ChevronDown, MessageCircle,
  GraduationCap,
} from 'lucide-react'

interface EnrolledClass {
  roster_id: string
  class_id: string
  name: string
  subject: string
  section: string
  schedule_day: string | null
  schedule_time: string | null
  room: string | null
  school_year: string | null
  semester: string | null
  adviser_id: string | null
  teacher_name: string
}

interface Classmate {
  student_id: string
  full_name: string
}

interface Announcement {
  id: string
  title: string
  message: string
  priority: number
  created_at: string
}

interface ClassworkItem {
  id: string
  class_id: string
  type: 'material' | 'assignment' | 'quiz' | 'doc'
  title: string
  description: string
  due_date: string | null
  points: number
  created_at: string
  done?: boolean
}

type View = 'grid' | 'stream' | 'classwork' | 'people' | 'assignment'

const BANNERS = [
  'linear-gradient(135deg,#1f4fa3,#163b7d)',
  'linear-gradient(135deg,#0e6e6e,#0a5252)',
  'linear-gradient(135deg,#132a52,#0c1c38)',
  'linear-gradient(135deg,#0a3d4d,#062633)',
  'linear-gradient(135deg,#1f7a5c,#155c44)',
  'linear-gradient(135deg,#2e8b57,#20613c)',
  'linear-gradient(135deg,#2456a8,#173b78)',
  'linear-gradient(135deg,#12463a,#0a2e26)',
]

const AVATAR_COLORS = ['#1f4fa3', '#8a94a8', '#7c3fae', '#c0562f', '#1f4fa3', '#2e5c9c', '#c0562f', '#8a94a8']

function init(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function ItemIcon({ type }: { type: string }) {
  const cls = type === 'quiz' ? 'bg-[#fdeee8] text-[#c0562f]'
    : type === 'doc' ? 'bg-[#eaf4ee] text-[#2e8b57]'
    : 'bg-[#e8edf9] text-[#1f4fa3]'
  return (
    <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
      {type === 'quiz' ? <CheckCircle size={17} /> : type === 'doc' ? <AlignJustify size={17} /> : <FileText size={17} />}
    </div>
  )
}

function Tabs({ active, onTab }: { active: string; onTab: (t: 'stream' | 'classwork' | 'people') => void }) {
  return (
    <div className="flex gap-[26px] border-b border-[#e1e5ec] mt-[14px] px-1">
      {(['stream', 'classwork', 'people'] as const).map(t => (
        <button key={t} onClick={() => onTab(t)}
          className={`pb-3 px-0.5 text-[13.5px] font-semibold border-b-[2.5px] border-transparent bg-transparent cursor-pointer capitalize transition-colors ${active === t ? 'text-[#1f4fa3] border-[#1f4fa3]' : 'text-[#6b7486] hover:text-[#1c2536]'}`}>
          {t}
        </button>
      ))}
    </div>
  )
}

export function Classes() {
  const notify = useNotification()
  const user = useAuthStore(s => s.user)

  const [classes, setClasses] = useState<EnrolledClass[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('grid')
  const [sel, setSel] = useState<EnrolledClass | null>(null)
  const [q, setQ] = useState('')
  const [nicks, setNicks] = useState<Record<string, string>>({})
  const [menu, setMenu] = useState<string | null>(null)
  const [workItem, setWorkItem] = useState<ClassworkItem | null>(null)
  const [done, setDone] = useState(false)
  const [unTarget, setUnTarget] = useState<EnrolledClass | null>(null)
  const [showUn, setShowUn] = useState(false)
  const [classmates, setClassmates] = useState<Classmate[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [classwork, setClasswork] = useState<ClassworkItem[]>([])

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    ;(async () => {
      const { data, error } = await supabase
        .from('class_rosters')
        .select('*, classes(*)')
        .eq('student_id', user.id)
      if (error || !data) { setLoading(false); return }

      const aids = [...new Set(data.map(r => r.classes?.adviser_id).filter(Boolean))] as string[]
      let tm: Record<string, string> = {}
      if (aids.length) {
        const { data: p } = await supabase.from('profiles').select('id, full_name').in('id', aids)
        p?.forEach(x => { tm[x.id] = x.full_name })
      }

      setClasses(data.map(r => ({
        roster_id: r.id,
        class_id: r.class_id,
        name: r.classes?.name ?? 'Unknown',
        subject: r.classes?.subject ?? '',
        section: r.classes?.section ?? '',
        schedule_day: r.classes?.schedule_day ?? null,
        schedule_time: r.classes?.schedule_time ?? null,
        room: r.classes?.room ?? null,
        school_year: r.classes?.school_year ?? null,
        semester: r.classes?.semester ?? null,
        adviser_id: r.classes?.adviser_id ?? null,
        teacher_name: r.classes?.adviser_id ? (tm[r.classes.adviser_id] ?? 'Teacher') : 'Teacher',
      })))

      const classIds = data.map(r => r.class_id).filter(Boolean) as string[]
      if (classIds.length) {
        const { data: rosterData } = await supabase
          .from('class_rosters')
          .select('student_id')
          .in('class_id', classIds)
        const sids = [...new Set((rosterData || []).map(r => r.student_id).filter(sid => sid !== user.id))]
        if (sids.length) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', sids)
          setClassmates((profiles || []).map(p => ({ student_id: p.id, full_name: p.full_name || 'Student' })))
        }
      }

      const { data: annData } = await supabase
        .from('announcements')
        .select('id, title, message, priority, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10)
      if (annData) setAnnouncements(annData as Announcement[])

      const { data: cwData } = await supabase
        .from('classwork')
        .select('*')
        .in('class_id', classIds)
        .order('created_at', { ascending: false })
      const { data: subData } = await supabase
        .from('classwork_submissions')
        .select('classwork_id')
        .eq('student_id', user.id)
      const doneIds = new Set((subData || []).map(s => s.classwork_id))
      if (cwData) setClasswork((cwData as ClassworkItem[]).map(cw => ({ ...cw, done: doneIds.has(cw.id) })))
      setLoading(false)
    })()
  }, [user?.id])

  const filtered = useMemo(() => {
    if (!q.trim()) return classes
    const l = q.toLowerCase()
    return classes.filter(c => c.name.toLowerCase().includes(l) || c.teacher_name.toLowerCase().includes(l) || c.subject.toLowerCase().includes(l))
  }, [classes, q])

  const first = classes[0]
  const termDisplay = first?.semester ? `${first.semester}, A.Y. ${first.school_year ?? '2026\u20132027'}` : '1st Semester, A.Y. 2026\u20132027'
  const termPill = first?.school_year ? `Current Term (A.Y. ${first.school_year.split('-').map(y => y.slice(2)).join('\u2013')})` : 'Current Term (A.Y. 26\u201327)'

  const openClass = (c: EnrolledClass, v: View = 'stream') => { setSel(c); setView(v); setWorkItem(null); setDone(false); setMenu(null) }
  const goTab = (t: 'stream' | 'classwork' | 'people') => { setView(t); setWorkItem(null); setDone(false) }
  const openWork = (item: ClassworkItem) => { setWorkItem(item); setDone(!!item.done); setView('assignment') }
  const goBack = () => { setView('grid'); setSel(null); setWorkItem(null) }

  const classworkFor = (classId: string) => classwork.filter(cw => cw.class_id === classId)

  const toggleDone = async () => {
    if (!workItem || !user) return
    const markingDone = !done
    try {
      if (markingDone) {
        const { error } = await supabase.from('classwork_submissions').upsert(
          { classwork_id: workItem.id, student_id: user.id, status: 'done' },
          { onConflict: 'classwork_id,student_id' }
        )
        if (error) throw error
      } else {
        const { error } = await supabase.from('classwork_submissions')
          .delete()
          .eq('classwork_id', workItem.id)
          .eq('student_id', user.id)
        if (error) throw error
      }
      setDone(markingDone)
      setClasswork(prev => prev.map(cw => cw.id === workItem.id ? { ...cw, done: markingDone } : cw))
      notify.success({ title: markingDone ? 'Marked as done' : 'Unsubmitted' })
    } catch (err) {
      notify.error({ title: markingDone ? 'Could not mark as done' : 'Could not unsubmit', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const bnr = (c: EnrolledClass) => BANNERS[classes.indexOf(c) % BANNERS.length] || BANNERS[0]
  const dName = (c: EnrolledClass) => nicks[c.class_id] || (c.schedule_day ? `${c.name} (${c.schedule_day}...)` : c.name)
  const bTitle = (c: EnrolledClass) => `${c.name}${c.schedule_day && c.schedule_time ? ` (${c.schedule_day} ${c.schedule_time})` : ''}`

  const handleEdit = (c: EnrolledClass, e: React.MouseEvent) => {
    e.stopPropagation(); setMenu(null)
    const n = window.prompt('Rename class nickname:', nicks[c.class_id] || c.name)
    if (n?.trim()) { setNicks(p => ({ ...p, [c.class_id]: n.trim() })); notify.success({ title: 'Nickname updated' }) }
  }

  const handleCopy = (c: EnrolledClass, e: React.MouseEvent) => {
    e.stopPropagation(); setMenu(null)
    const code = `k3f-${c.class_id.slice(0, 4)}`
    navigator.clipboard?.writeText(code).then(() => notify.success({ title: `Class code "${code}" copied` })).catch(() => notify.info({ title: `Class code: ${code}` }))
  }

  const handleUn = (c: EnrolledClass, e: React.MouseEvent) => {
    e.stopPropagation(); setMenu(null); setUnTarget(c); setShowUn(true)
  }

  const confirmUn = async () => {
    if (!unTarget) return
    const { error } = await supabase.from('class_rosters').delete().eq('id', unTarget.roster_id)
    if (error) notify.error({ title: 'Could not unenroll. Only administrators can manage enrollment.' })
    else {
      setClasses(p => p.filter(c => c.roster_id !== unTarget.roster_id))
      notify.success({ title: 'Unenrolled from class' })
      if (sel?.roster_id === unTarget.roster_id) goBack()
    }
    setShowUn(false); setUnTarget(null)
  }

  useEffect(() => {
    if (!menu) return
    const h = () => setMenu(null)
    const t = setTimeout(() => document.addEventListener('click', h), 0)
    return () => { clearTimeout(t); document.removeEventListener('click', h) }
  }, [menu])

  return (
    <StudentLayout title="Classes">
      <div className="max-w-[1180px] mx-auto px-5 md:px-7 pb-10">

        {view === 'grid' && (
          <>
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <h1 className="text-[22px] font-bold m-0 mb-0.5">
                  Enrolled Classes{' '}
                  <span className="font-medium text-sm text-[#6b7486]">{classes.length} Course{classes.length !== 1 ? 's' : ''}</span>
                </h1>
                <div className="text-[13px] text-[#6b7486]">{termDisplay}</div>
              </div>
              <div className="flex gap-2.5 items-center flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-[#e1e5ec] rounded-lg px-3 py-2 text-[12.5px] text-[#6b7486] min-w-[220px]">
                  <Search size={15} className="shrink-0" />
                  <input value={q} onChange={e => setQ(e.target.value)}
                    placeholder="Search class or teacher..."
                    className="border-none outline-none bg-transparent text-[12.5px] text-[#1c2536] w-full placeholder:text-[#6b7486]" />
                </div>
                <div className="border border-[#e1e5ec] bg-white rounded-lg px-3.5 py-2 text-[12.5px] whitespace-nowrap">{termPill}</div>
                <button onClick={() => notify.info({ title: 'Class enrollment is handled by your teachers or the school admin.' })}
                  className="bg-[#1f4fa3] text-white border-none rounded-lg px-4 py-[9px] text-[12.5px] font-semibold flex items-center gap-1.5 whitespace-nowrap hover:bg-[#1a4590] transition-colors">
                  + Join class
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-sm text-[#6b7486]">Loading classes\u2026</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-[70px] px-6 border-[1.5px] border-dashed border-[#e1e5ec] rounded-[14px] bg-white">
                <div className="w-16 h-16 rounded-full bg-[rgba(31,79,163,.08)] text-[#1f4fa3] flex items-center justify-center mb-[18px]">
                  <GraduationCap size={28} />
                </div>
                <h3 className="m-0 mb-2 text-base font-bold">No enrolled classes yet</h3>
                <p className="m-0 max-w-[360px] text-[13.5px] text-[#6b7486] leading-relaxed">
                  {q ? 'No classes match your search.' : "More classes added by your teachers or the school admin will show up here once they're posted."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
                {filtered.map((c, i) => (
                  <div key={c.class_id} onClick={() => openClass(c)}
                    className="bg-white border border-[#e1e5ec] rounded-xl overflow-hidden flex flex-col cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(15,42,92,.12)]">
                    <div className="h-[88px] p-3.5 text-white relative overflow-hidden flex flex-col justify-start" style={{ background: BANNERS[i % BANNERS.length] }}>
                      <div className="text-[14.5px] font-bold leading-tight max-w-[78%]">{dName(c)}</div>
                      <div className="text-[11.5px] opacity-90 mt-0.5">{c.teacher_name}</div>
                      <div className="absolute right-3 -bottom-4 w-11 h-11 rounded-full border-[3px] border-white flex items-center justify-center text-xs font-bold"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {init(c.teacher_name)}
                      </div>
                    </div>
                    <div className="flex-1 px-4 pt-6 pb-2" />
                    <div className="flex items-center justify-end gap-3.5 px-3.5 py-2 border-t border-[#e1e5ec] text-[#6b7486]">
                      <span className="flex-1" />
                      <button onClick={e => handleEdit(c, e)} className="bg-transparent border-none p-1.5 rounded-full hover:bg-[rgba(31,79,163,.1)] hover:text-[#1f4fa3] transition-colors" title="Edit class nickname"><Pencil size={16} /></button>
                      <button onClick={e => handleCopy(c, e)} className="bg-transparent border-none p-1.5 rounded-full hover:bg-[rgba(31,79,163,.1)] hover:text-[#1f4fa3] transition-colors" title="Copy class code"><Copy size={16} /></button>
                      <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setMenu(menu === c.class_id ? null : c.class_id) }}
                          className="bg-transparent border-none p-1.5 rounded-full hover:bg-[rgba(31,79,163,.1)] hover:text-[#1f4fa3] transition-colors" title="More options"><MoreHorizontal size={16} /></button>
                        {menu === c.class_id && (
                          <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-[#e1e5ec] rounded-[10px] shadow-[0_8px_24px_rgba(15,42,92,.16)] min-w-[170px] overflow-hidden z-20">
                            <button onClick={e => handleEdit(c, e)} className="block w-full text-left bg-transparent border-none py-2.5 px-3.5 text-[12.5px] text-[#1c2536] hover:bg-[rgba(31,79,163,.07)]">Edit nickname</button>
                            <button onClick={e => handleCopy(c, e)} className="block w-full text-left bg-transparent border-none py-2.5 px-3.5 text-[12.5px] text-[#1c2536] hover:bg-[rgba(31,79,163,.07)]">Copy invite link</button>
                            <button onClick={e => handleUn(c, e)} className="block w-full text-left bg-transparent border-none py-2.5 px-3.5 text-[12.5px] text-[#e0483e] hover:bg-[rgba(224,72,62,.07)]">Unenroll</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-center mt-5 mb-0 text-[12.5px] text-[#6b7486]">More classes added by your teachers or the school admin will show up here once they're posted.</p>
          </>
        )}

        {view === 'stream' && sel && (
          <>
            <div className="rounded-xl p-[26px] text-white" style={{ background: bnr(sel) }}>
              <h2 className="m-0 text-lg font-bold">{bTitle(sel)}</h2>
            </div>
            <Tabs active="stream" onTab={goTab} />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[22px] items-start mt-[22px]">
              <div>
                <button onClick={() => notify.info({ title: 'Only teachers can post announcements in this class.' })}
                  className="flex items-center gap-2 bg-white border border-[#e1e5ec] rounded-full px-[18px] py-2.5 text-[13px] font-semibold text-[#1f4fa3] mb-4 w-fit hover:bg-[rgba(31,79,163,.06)] transition-colors">
                  <MessageCircle size={15} /> New announcement
                </button>
                <div className="bg-white border border-[#e1e5ec] rounded-xl overflow-hidden">
                  {(() => {
                    const cwItems = classworkFor(sel.class_id).map(cw => ({
                      key: cw.id,
                      type: cw.type as string,
                      title: cw.title,
                      date: new Date(cw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      isClasswork: true,
                      item: cw,
                    }))
                    const annItems = announcements.map(a => ({
                      key: a.id,
                      type: (a.priority >= 3 ? 'quiz' : 'material') as string,
                      title: a.title,
                      date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      isClasswork: false,
                      item: null as ClassworkItem | null,
                    }))
                    const stream = [...cwItems, ...annItems]
                    if (stream.length === 0) {
                      return <div className="px-[18px] py-6 text-center text-[13px] text-[#6b7486]">No announcements or classwork yet.</div>
                    }
                    return stream.map(s => (
                      <div key={s.key} onClick={() => (s.isClasswork && s.item ? openWork(s.item) : goTab('classwork'))}
                        className="flex items-center gap-3 px-[18px] py-3.5 border-b border-[#e1e5ec] text-[13.5px] last:border-b-0 hover:bg-[rgba(31,79,163,.04)] cursor-pointer">
                        <ItemIcon type={s.type} />
                        <div className="flex-1 min-w-0">
                          {s.isClasswork
                            ? <><b>{sel.teacher_name}</b> posted a new {s.type}: {s.title}</>
                            : <><b>{s.title}</b></>}
                        </div>
                        <div className="text-[11.5px] text-[#6b7486] whitespace-nowrap">{s.date}</div>
                        <span className="text-[#6b7486] text-base px-1 select-none">{'\u22EE'}</span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
              <div>
                {(() => {
                  const today = new Date().toISOString().split('T')[0]
                  const upcoming = classworkFor(sel.class_id)
                    .filter(cw => cw.due_date && cw.due_date >= today && !cw.done)
                    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
                  return (
                    <div className="bg-white border border-[#e1e5ec] rounded-xl p-4">
                      <div className="text-[11.5px] text-[#6b7486] mb-1">Upcoming</div>
                      {upcoming.length === 0 ? (
                        <div className="text-[13.5px] font-medium">Woohoo, no work due soon!</div>
                      ) : upcoming.slice(0, 3).map(cw => (
                        <div key={cw.id} onClick={() => openWork(cw)}
                          className="py-1.5 border-b border-[#f0f1f6] last:border-0 cursor-pointer hover:bg-[rgba(31,79,163,.04)] -mx-1 px-1 rounded">
                          <div className="text-[12.5px] font-medium truncate">{cw.title}</div>
                          <div className="text-[10.5px] text-[#c0562f] font-semibold">
                            Due {new Date(cw.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                      {upcoming.length > 0 && (
                        <button onClick={() => goTab('classwork')}
                          className="text-xs text-[#1f4fa3] font-semibold float-right -mt-4 bg-transparent border-none cursor-pointer hover:underline">View all</button>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </>
        )}

        {view === 'classwork' && sel && (
          <>
            <div className="rounded-xl p-[26px] text-white" style={{ background: bnr(sel) }}>
              <h2 className="m-0 text-lg font-bold">{bTitle(sel)}</h2>
            </div>
            <Tabs active="classwork" onTab={goTab} />
            <div className="flex items-center justify-end gap-2.5 mt-[22px] mb-3.5">
              <button className="flex items-center gap-1.5 bg-white border border-[#e1e5ec] rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#1f4fa3] hover:bg-[rgba(31,79,163,.06)] transition-colors">
                <CheckCircle size={14} /> View your work
              </button>
              <button className="flex items-center gap-1.5 bg-white border border-[#e1e5ec] rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#1f4fa3] hover:bg-[rgba(31,79,163,.06)] transition-colors">
                <ChevronDown size={14} /> Collapse all
              </button>
            </div>
            <div className="flex items-center justify-between font-bold text-sm mt-5 mb-2.5">
              No topic <ChevronDown size={16} className="text-[#6b7486]" />
            </div>
            <div className="bg-white border border-[#e1e5ec] rounded-xl overflow-hidden">
              {classworkFor(sel.class_id).length === 0 ? (
                <div className="px-[18px] py-6 text-center text-[13px] text-[#6b7486]">No classwork posted yet.</div>
              ) : classworkFor(sel.class_id).map((item) => (
                <div key={item.id} onClick={() => openWork(item)}
                  className="flex items-center gap-3 px-[18px] py-3.5 border-b border-[#e1e5ec] text-[13.5px] last:border-b-0 hover:bg-[rgba(31,79,163,.04)] cursor-pointer">
                  <ItemIcon type={item.type} />
                  <div className="flex-1 min-w-0">{item.title}{item.done && <span className="ml-2 text-[10px] text-emerald-600 font-semibold">✓ Done</span>}</div>
                  <div className="text-[11.5px] text-[#6b7486] whitespace-nowrap">
                    {item.due_date ? `Due ${new Date(item.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : `Posted ${new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'assignment' && sel && workItem && (
          <>
            <div className="text-[12px] text-[#6b7486] mb-1.5">
              <button onClick={() => goTab('stream')} className="bg-transparent border-none text-[#6b7486] cursor-pointer hover:underline text-xs">{bTitle(sel)}</button>
              <span className="mx-1.5 opacity-60">&rsaquo;</span>
              <button onClick={() => goTab('classwork')} className="bg-transparent border-none text-[#6b7486] cursor-pointer hover:underline text-xs">Classwork</button>
              <span className="mx-1.5 opacity-60">&rsaquo;</span>
              {workItem?.title}
            </div>
            <div className="flex gap-[26px] border-b border-[#e1e5ec] mt-2 px-1">
              {(['stream', 'classwork', 'people'] as const).map(t => (
                <button key={t} onClick={() => goTab(t)}
                  className={`pb-3 px-0.5 text-[13.5px] font-semibold border-b-[2.5px] border-transparent bg-transparent cursor-pointer capitalize transition-colors ${t === 'classwork' ? 'text-[#1f4fa3] border-[#1f4fa3]' : 'text-[#6b7486] hover:text-[#1c2536]'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[22px] items-start mt-[22px]">
              <div className="bg-white border border-[#e1e5ec] rounded-xl p-4">
                <div className="flex gap-3.5 items-start pb-3.5 border-b border-[#e1e5ec] mb-3.5">
                  <div className="w-[46px] h-[46px] rounded-full bg-[#e8edf9] text-[#1f4fa3] flex items-center justify-center shrink-0"><FileText size={22} /></div>
                  <div>
                    <h3 className="m-0 mb-1 text-[17px] font-bold">{workItem?.title}</h3>
                    <div className="text-[12.5px] text-[#6b7486]">
                      {sel.teacher_name} &middot; {workItem?.created_at ? new Date(workItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} &middot; {workItem?.points ?? 100} points
                    </div>
                  </div>
                </div>
                <div className="text-[13.5px] leading-relaxed mb-[18px]">
                  {workItem?.description || 'Please follow the guidelines provided by your teacher for this item.'}
                  {workItem?.due_date && (
                    <div className="mt-2 text-[12.5px] font-semibold text-[#c0562f]">
                      Due: {new Date(workItem.due_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <div className="border-t border-[#e1e5ec] pt-3.5 flex flex-col gap-2.5">
                  <div className="text-[12.5px] font-semibold text-[#6b7486]">Class comments</div>
                  <button onClick={() => notify.info({ title: 'Comments are managed by your teacher.' })} className="bg-transparent border-none text-[13px] text-[#1f4fa3] font-semibold cursor-pointer hover:underline">+ Add comment</button>
                </div>
              </div>
              <div>
                <div className="bg-white border border-[#e1e5ec] rounded-xl p-4 mb-3.5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold">Your work</div>
                    <div className="text-[11.5px] text-[#6b7486]">{done ? 'Turned in' : 'Assigned'}</div>
                  </div>
                  <button className="flex items-center justify-center gap-1.5 w-full border border-[#e1e5ec] rounded-lg py-2.5 text-[13px] font-semibold text-[#1c2536] bg-white mb-2.5 hover:bg-[rgba(31,79,163,.06)] transition-colors">
                    + Add or create
                  </button>
                  <button onClick={toggleDone}
                    className="flex items-center justify-center w-full bg-[#1f4fa3] text-white border-none rounded-lg py-2.5 text-[13px] font-bold hover:bg-[#1a4590] transition-colors">
                    {done ? 'Unsubmit' : 'Mark as done'}
                  </button>
                </div>
                <div className="bg-white border border-[#e1e5ec] rounded-xl p-4">
                  <div className="text-[12.5px] font-semibold text-[#6b7486] mb-2">Private comments</div>
                  <button onClick={() => notify.info({ title: 'Comments are managed by your teacher.' })} className="bg-transparent border-none text-[12.5px] text-[#1f4fa3] cursor-pointer hover:underline">
                    + Add comment to {sel.teacher_name.split(' ')[0]}...
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'people' && sel && (
          <>
            <div className="rounded-xl p-[26px] text-white" style={{ background: bnr(sel) }}>
              <h2 className="m-0 text-lg font-bold">{bTitle(sel)}</h2>
            </div>
            <Tabs active="people" onTab={goTab} />
            <div className="bg-white border border-[#e1e5ec] rounded-xl p-[22px_24px] mt-[22px]">
              <div className="mb-[26px]">
                <h3 className="text-[13px] font-bold m-0 mb-3">Teachers</h3>
                <div className="flex items-center gap-3.5 py-[11px] border-b border-[#e1e5ec] text-[13.5px]">
                  <div className="w-8 h-8 rounded-full bg-[#1f4fa3] text-white flex items-center justify-center text-xs font-bold shrink-0">{init(sel.teacher_name)}</div>
                  {sel.teacher_name}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[13px] font-bold m-0">Classmates</h3>
                  <span className="text-xs text-[#6b7486] font-medium">{classmates.length} students</span>
                </div>
                {classmates.length === 0 ? (
                  <div className="py-4 text-center text-[13px] text-[#6b7486]">No classmates found.</div>
                ) : classmates.map((m, i) => (
                  <div key={m.student_id} className="flex items-center gap-3.5 py-[11px] border-b border-[#e1e5ec] text-[13.5px] last:border-b-0">
                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {init(m.full_name)}
                    </div>
                    {m.full_name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmModal open={showUn} title="Unenroll from Class"
        message={`Are you sure you want to unenroll from ${unTarget?.name ?? 'this class'}? You will lose access to all class materials and assignments.`}
        confirmLabel="Unenroll" danger onConfirm={confirmUn}
        onCancel={() => { setShowUn(false); setUnTarget(null) }} />
    </StudentLayout>
  )
}

export default Classes
