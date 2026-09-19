import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotification } from '../hooks/useNotification'
import { useSettings } from '../hooks/useSettings'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'

interface InquiryForm {
  department: string
  subject: string
  message: string
}

const DEPARTMENTS = [
  { value: 'registrar', label: "Registrar's Office (Records, TOR, Permits)" },
  { value: 'accounting', label: 'Accounting & Cashier Office' },
  { value: 'edp', label: 'EDP Office' },
]

const FAQS = [
  {
    q: 'How do I report a schedule conflict or room change?',
    a: 'Immediately report any scheduling discrepancies, section transfers, or room adjustment needs directly to the EDP Office on the 2nd Floor. The EDP Office handles schedule and room plotting concerns.',
  },
  {
    q: 'How do I request a replacement for a lost or damaged Student ID?',
    a: "Visit the Registrar's Office and ask about the student ID replacement process. Bring the required information and follow the office instructions.",
  },
  {
    q: 'Can I request my Transcript of Records (TOR) or Honorable Dismissal?',
    a: "Coordinate with the Registrar's Office regarding the requirements and processing of academic documents.",
  },
  {
    q: 'Where can I verify my tuition payments or CEC PAY transaction?',
    a: 'Visit the Accounting and Cashier Office for verification of tuition payments and official receipts.',
  },
]

const OFFICES = [
  {
    icon: 'grad',
    tag: 'ADMIN GROUND',
    name: "Registrar's Office",
    desc: 'Official academic records, Transcript of Records (TOR), Honorable Dismissal, Good Moral Certification, Student ID validation, and enrollment validation slips.',
  },
  {
    icon: 'card',
    tag: 'ADMIN GROUND',
    name: 'Accounting & Cashier Office',
    desc: 'Tuition fee breakdown assessment, CEC PAY digital ledger verification, payment confirmation, and Official Receipts (OR).',
  },
  {
    icon: 'sched',
    tag: '2ND FLOOR',
    name: 'EDP Office',
    desc: 'Handles class schedules and room assignments, manages EDP adjustment slips, and assists with student grades and academic evaluation concerns.',
  },
]

function OfficeIcon({ type }: { type: string }) {
  const paths: Record<string, string> = {
    grad: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
    card: 'M2 5h20v14H2z M2 10h20',
    sched: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  }
  return (
    <div className="w-[30px] h-[30px] rounded-md bg-[#EAF0FF] text-[#2F5DD4] flex items-center justify-center shrink-0">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={paths[type] || paths.grad} /></svg>
    </div>
  )
}

export function Help() {
  const user = useAuthStore(s => s.user)
  const notify = useNotification()
  const { school } = useSettings()

  const [form, setForm] = useState<InquiryForm>({ department: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => { document.title = 'Help & Campus Support Desk' }, [])

  const phone = school?.phone || '(032) 256 2523'
  const email = school?.email || 'cebueasterncollege1915@yahoo.com'
  const address = school?.address || 'Leon Kilat St., Cebu City'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      notify.warning({ title: 'Sign in required', message: 'Please sign in to submit an inquiry ticket.' })
      return
    }
    if (!form.department || !form.subject.trim() || !form.message.trim()) {
      notify.warning({ title: 'Incomplete form', message: 'Please fill in all required fields.' })
      return
    }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('inquiries').insert({
        student_id: user.id,
        department: form.department,
        subject: form.subject.trim(),
        message: form.message.trim(),
        status: 'pending',
      })
      if (error) throw error
      notify.success({ title: 'Ticket submitted', message: 'Your inquiry has been sent to campus administrators.' })
      setForm({ department: '', subject: '', message: '' })
    } catch (err) {
      notify.error({ title: 'Failed to submit', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StudentLayout title="Help & Campus Support Desk">
      <div className="max-w-[1200px] mx-auto px-1 md:px-2">

        {/* Header row with trunkline */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[#4969C8] text-[10px] font-bold tracking-wide mb-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              STUDENT SERVICES & CAMPUS DIRECTORY
            </div>
            <h1 className="text-[22px] font-bold text-[#172746] m-0 mb-1">Help & Campus Support Desk</h1>
            <p className="text-[12.5px] text-[#7D8799] m-0 max-w-[520px] leading-relaxed">
              Official service directory, frequently asked academic inquiries,
              and campus administrative channels for BSIT students.
            </p>
          </div>
          <div className="bg-white border border-[#DFE5EF] rounded-md px-3.5 py-2.5 min-w-[160px] shrink-0">
            <div className="text-[8px] text-[#929BAD] font-semibold tracking-wide mb-1">CAMPUS TRUNKLINE</div>
            <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#183B74]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              {phone}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
          {[
            { label: 'OFFICE HOURS', value: '8:00 AM - 5:00 PM', sub: 'Mon-Fri 8AM-5PM | Sat 8AM-12PM' },
            { label: 'OFFICIAL DESKS', value: '3 Main Offices', sub: 'Registrar, Accounting & EDP' },
            { label: 'OFFICIAL CONTACT', value: phone, sub: 'Main Telephone' },
            { label: 'OFFICIAL INQUIRY EMAIL', value: email, sub: 'General Campus Administration' },
          ].map(c => (
            <div key={c.label} className="bg-white border border-[#DFE5EF] rounded-md px-3 py-2.5">
              <div className="text-[8px] text-[#8B94A5] font-semibold tracking-wide mb-1">{c.label}</div>
              <div className="text-[11.5px] font-bold text-[#24324B] mb-0.5 break-words">{c.value}</div>
              <div className="text-[9.5px] text-[#7E8799]">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Support Directory */}
        <section className="mb-5">
          <h3 className="text-[13px] font-bold text-[#1B2945] m-0 mb-0.5">Quick Support Directory</h3>
          <p className="text-[11px] text-[#8A92A3] m-0 mb-2.5">On-campus offices, locations, and scope of student transactions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {OFFICES.map(o => (
              <div key={o.name} className="bg-white border border-[#DFE5EF] rounded-lg px-3 py-3">
                <div className="flex items-center justify-between mb-2.5">
                  <OfficeIcon type={o.icon} />
                  <span className="bg-[#EAF0FF] text-[#5570B7] px-2 py-0.5 text-[8px] font-bold rounded">{o.tag}</span>
                </div>
                <h3 className="text-[12.5px] font-bold text-[#1E3154] m-0 mb-1.5">{o.name}</h3>
                <p className="text-[11px] text-[#7C8596] leading-[1.55] m-0 mb-2.5">{o.desc}</p>
                <div className="flex items-center justify-between text-[9.5px] text-[#727B8D]">
                  <span className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Mon-Fri 8AM-5PM | Sat 8AM-12PM
                  </span>
                  <b className="text-[#315DD3] font-bold">MON - SAT</b>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lower: FAQ + Inquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">

          {/* FAQ */}
          <section className="bg-white border border-[#DFE5EF] rounded-lg px-3.5 py-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-[11.5px] font-bold text-[#1B2945] m-0 mb-0.5">▣ BSIT KNOWLEDGE BASE</h3>
                <h2 className="text-[14px] font-bold text-[#1B2945] m-0">Frequently Asked Inquiries</h2>
              </div>
              <span className="text-[#4562C2] text-[9.5px] font-bold whitespace-nowrap">{FAQS.length} ANSWERS</span>
            </div>
            <p className="text-[10.5px] text-[#8A92A3] leading-[1.45] m-0 mb-2.5">
              Official answers and resolution steps for recurring academic, technical, and campus administrative concerns.
            </p>
            <div className="flex flex-col gap-1.5">
              {FAQS.map((f, i) => (
                <details key={i} open={openFaq === i} onToggle={(e) => setOpenFaq((e.target as HTMLDetailsElement).open ? i : null)}
                  className="bg-white border border-[#DFE5EF] rounded-md overflow-hidden">
                  <summary className="px-3 py-2.5 cursor-pointer text-[11.5px] font-bold text-[#263753] list-none flex items-center justify-between select-none">
                    {f.q}
                    <span className="text-[#68758B] text-[10px]">{openFaq === i ? '⌃' : '⌄'}</span>
                  </summary>
                  <p className="px-3 pb-2.5 text-[10.5px] text-[#7A8496] leading-[1.55] m-0">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Inquiry form */}
          <section className="bg-white border border-[#DFE5EF] rounded-lg px-3.5 py-3.5">
            <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-[#1D3154] m-0 mb-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Submit an Inquiry
            </h3>
            <p className="text-[10.5px] text-[#7D8798] leading-[1.5] m-0 mb-2.5">
              Send an electronic ticket directly to campus administrators for urgent matters.
            </p>
            <form onSubmit={handleSubmit}>
              <label className="block text-[9px] text-[#657087] font-bold tracking-wide mb-1">DEPARTMENT DESK</label>
              <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required
                className="w-full border border-[#D9DFEB] rounded px-2 py-2 text-[11px] text-[#1F2433] bg-white outline-none mb-2.5 focus:border-[#5273DB]">
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>

              <label className="block text-[9px] text-[#657087] font-bold tracking-wide mb-1">INQUIRY SUBJECT</label>
              <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Replacement for lost Student ID" required
                className="w-full border border-[#D9DFEB] rounded px-2 py-2 text-[11px] text-[#1F2433] bg-white outline-none mb-2.5 focus:border-[#5273DB]" />

              <label className="block text-[9px] text-[#657087] font-bold tracking-wide mb-1">DETAILED EXPLANATION</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="State your student ID, section, and specific query..." required rows={4}
                className="w-full border border-[#D9DFEB] rounded px-2 py-2 text-[11px] text-[#1F2433] bg-white outline-none mb-3 resize-none focus:border-[#5273DB]" />

              <button type="submit" disabled={submitting}
                className="w-full bg-[#092E65] hover:bg-[#16427F] active:scale-[0.99] disabled:opacity-60 text-white border-none rounded px-3 py-2.5 text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>

            <div className="border-t border-[#EDF0F5] mt-2.5 pt-2 text-[10px] text-[#727C8F] leading-[1.7]">
              ☎ {phone}
              <br />
              ✉ {email}
            </div>
          </section>
        </div>

        <div className="text-center text-[9.5px] text-[#8B94A5] mt-5 pt-3 border-t border-[#E1E5ED] flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#22A06B] rounded-full inline-block" />
          © 2026 Cebu Eastern College. All Systems Operational · {address}
        </div>
      </div>
    </StudentLayout>
  )
}

export default Help
