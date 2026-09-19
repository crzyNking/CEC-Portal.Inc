import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotification } from '../hooks/useNotification'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'
import {
  Receipt, History, Download, ClipboardList, CheckCircle2, Wallet, CreditCard,
  Info, Landmark, ListChecks, TrendingUp, AlertTriangle, Clock, FileText,
  Filter, Printer, ExternalLink,
} from 'lucide-react'

interface EnrollmentRecord {
  id_number: string | null
  level: string
  status: string
}

interface BillingRecord {
  id: string
  total_due: number | null
  balance: number | null
  tuition_fee: number | null
  misc_fees: number | null
  discount: number | null
  status: string
  school_year: string
  semester: string
  created_at: string
}

interface PaymentRecord {
  id: string
  billing_id: string
  amount: number
  method: string
  reference_no: string | null
  paid_at: string
  verified: boolean
}

const TIER_NAMES = [
  'Downpayment & Enrollment',
  'Prelim Exam Installment',
  'Midterm Exam Installment',
  'Semi-Final Installment',
  'Final Exam & Clearance Balance',
]

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Payments() {
  const user = useAuthStore((s) => s.user)
  const notify = useNotification()
  const [enrollment, setEnrollment] = useState<EnrollmentRecord | null>(null)
  const [billing, setBilling] = useState<BillingRecord[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<'installment' | 'full'>('installment')
  const [selectedMethod, setSelectedMethod] = useState<'banking' | 'ewallet' | 'otc'>('banking')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      const [enrollRes, billingRes, payRes] = await Promise.all([
        supabase.from('enrollment_submissions').select('*').eq('student_id', user.id).order('claimed_at', { ascending: false }).limit(1),
        supabase.from('billing_accounts').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('paid_at', { ascending: false }),
      ])
      if (enrollRes.data?.[0]) setEnrollment(enrollRes.data[0])
      if (billingRes.data) setBilling(billingRes.data)
      const billingIds = (billingRes.data || []).map((b: BillingRecord) => b.id)
      if (payRes.data) setPayments((payRes.data as PaymentRecord[]).filter((p) => billingIds.includes(p.billing_id)))
      setLoading(false)
    }
    load()
  }, [user])

  const stats = useMemo(() => {
    const totalAssessment = billing.reduce((s, b) => s + (b.total_due || 0), 0)
    const paid = payments.filter(p => p.verified).reduce((s, p) => s + p.amount, 0)
    const balance = billing.reduce((s, b) => s + (b.balance || 0), 0)
    const perTier = billing.length > 0 ? (billing[0].total_due || 0) / 5 : 0
    const paidTiers = perTier > 0 ? Math.floor(paid / perTier) : 0
    const percentPaid = totalAssessment > 0 ? Math.min(100, (paid / totalAssessment) * 100).toFixed(2) : '0.00'
    return { totalAssessment, paid, balance, perTier, paidTiers, percentPaid }
  }, [billing, payments])

  const tiers = useMemo(() => {
    // Compute the next target months from today instead of hardcoded dates
    const now = new Date()
    const targetMonths = [0, 1].map(offset => {
      const d = new Date(now.getFullYear(), now.getMonth() + 2 + offset, 1)
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    })
    return TIER_NAMES.map((name, i) => {
      let status: 'received' | 'due' | 'upcoming' = 'upcoming'
      if (i < stats.paidTiers) status = 'received'
      else if (i === stats.paidTiers && stats.perTier > 0 && stats.balance > 0) status = 'due'
      const payment = payments.filter(p => p.verified).sort((a, b) => new Date(a.paid_at).getTime() - new Date(b.paid_at).getTime())[i]
      return {
        name,
        amount: stats.perTier,
        status,
        settledInfo: status === 'received' && payment
          ? `Settled: ${new Date(payment.paid_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} · OR #${payment.reference_no || '—'}`
          : status === 'due'
            ? 'Active Due Date · Current Term Assessment'
            : `Target Schedule: ${targetMonths[Math.min(i - stats.paidTiers - 1, targetMonths.length - 1)] || 'End of Term'}`,
      }
    })
  }, [stats, payments])

  const currentBilling = billing[0]
  const settleAmount = selectedAmount === 'installment' ? stats.perTier : stats.balance

  const methodName = selectedMethod === 'banking' ? 'Online Banking' : selectedMethod === 'ewallet' ? 'GCash / Maya' : 'Over-the-Counter'

  const selectedDescription = selectedAmount === 'installment'
      ? `Midterm Assessment Installment (₱${fmt(stats.perTier)})`
      : `Full Installment Balance (₱${fmt(stats.balance)})`

  const handleProceed = async () => {
    if (!user) return
    if (settleAmount <= 0) {
      notify.warning({ title: 'Nothing to settle', message: 'Your balance is fully settled.' })
      return
    }
    if (!currentBilling?.id) {
      notify.warning({ title: 'No billing account', message: 'No active billing account found. Please contact the registrar.' })
      return
    }
    setSubmitting(true)
    try {
      const refNo = `CEC-PAY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      const { error } = await supabase.from('payments').insert({
        billing_id: currentBilling.id,
        amount: settleAmount,
        method: selectedMethod === 'banking' ? 'Online Banking' : selectedMethod === 'ewallet' ? 'GCash / Maya' : 'Over-the-Counter',
        reference_no: refNo,
        paid_at: new Date().toISOString(),
        verified: false,
      })
      if (error) throw error
      notify.success({ title: 'Payment submitted', message: `Your ${methodName} payment of ₱${fmt(settleAmount)} is being processed. OR will be posted upon verification.` })
      const [billingRes, payRes] = await Promise.all([
        supabase.from('billing_accounts').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('paid_at', { ascending: false }),
      ])
      if (billingRes.data) setBilling(billingRes.data)
      const billingIds = (billingRes.data || []).map((b: BillingRecord) => b.id)
      if (payRes.data) setPayments((payRes.data as PaymentRecord[]).filter((p) => billingIds.includes(p.billing_id)))
    } catch (err: unknown) {
      notify.error({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to submit payment.' })
    } finally {
      setSubmitting(false)
    }
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const subLine = currentBilling
    ? `Academic Year ${currentBilling.school_year} · ${currentBilling.semester} · Student ID: ${enrollment?.id_number || '—'} · ${enrollment?.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Regular'} Status`
    : `Student ID: ${enrollment?.id_number || '—'}`

  return (
    <StudentLayout title="Payments">
      <div className="max-w-[1200px]">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <Receipt width={13} height={13} /> STUDENT FINANCIAL ACCOUNTS & BILLING
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Tuition & Assessment Ledger</h1>
            <p className="mt-1 text-sm text-slate-500">{subLine}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scrollTo('history')} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <History width={16} height={16} /> Payment History
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d2547] transition-colors">
              <Download width={16} height={16} /> Download Statement of Account (SOA)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#0B1F3A]/30 border-t-[#0B1F3A] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400">TOTAL ASSESSMENT</p>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                    <ClipboardList width={13} height={13} className="text-slate-500" />
                  </div>
                </div>
                <p className="mb-2 text-xl font-bold text-slate-900">₱ {fmt(stats.totalAssessment)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tuition & Miscellaneous Fees</span>
                  <span className="font-medium text-slate-500">100% Assessed</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400">TOTAL AMOUNT PAID</p>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                    <CheckCircle2 width={13} height={13} className="text-slate-500" />
                  </div>
                </div>
                <p className="mb-2 text-xl font-bold text-slate-900">₱ {fmt(stats.paid)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Verified Received</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">{stats.percentPaid}% CLEARED</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400">REMAINING BALANCE</p>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                    <Wallet width={13} height={13} className="text-slate-500" />
                  </div>
                </div>
                <p className="mb-2 text-xl font-bold text-slate-900">₱ {fmt(stats.balance)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Current Term Standing</span>
                  <span className="font-medium text-blue-600 underline">Installment Plan Active</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold leading-tight tracking-wider text-slate-500">
                    DUE: MIDTERM<br />INSTALLMENT
                  </p>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">PENDING</span>
                </div>
                <p className="mb-2 text-xl font-bold text-slate-900">₱ {fmt(stats.perTier)}</p>
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <span>⏱ Due: Current Term</span>
                  <button onClick={() => scrollTo('settle')} className="font-semibold underline">Settle Below</button>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <section id="settle" className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <CreditCard width={18} height={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Pay Online / Settle Fees</p>
                    <p className="text-sm text-slate-500">Secure real-time transaction processing directly synced to the CEC Cashier's Office.</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                  <Receipt width={12} height={12} /> Official Receipt (OR) posted automatically upon confirmation
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400">1. SELECT AMOUNT TO SETTLE</p>

                  <button onClick={() => setSelectedAmount('installment')}
                    className={`mb-3 w-full rounded-xl border p-4 text-left transition ${selectedAmount === 'installment' ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selectedAmount === 'installment' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {selectedAmount === 'installment' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                        </span>
                        Installment (Current Due)
                      </span>
                      <span className="font-semibold text-slate-900">₱ {fmt(stats.perTier)}</span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-slate-500">Active payment tranche under standard 5-tier installment plan</p>
                  </button>

                  <button onClick={() => setSelectedAmount('full')}
                    className={`mb-4 w-full rounded-xl border p-4 text-left transition ${selectedAmount === 'full' ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selectedAmount === 'full' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {selectedAmount === 'full' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                        </span>
                        Full Installment Balance
                      </span>
                      <span className="font-semibold text-slate-900">₱ {fmt(stats.balance)}</span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-slate-500">Clear standard ledger assessment across all remaining installments</p>
                  </button>

                  <p className="mb-6 flex items-start gap-2 text-xs text-slate-500">
                    <Info width={14} height={14} className="mt-0.5 shrink-0" />
                    Payment applies sequentially to the oldest pending installment tranche. Official receipts are issued within 2–5 minutes.
                  </p>

                  <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400">2. SELECT PAYMENT METHOD</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button onClick={() => setSelectedMethod('banking')}
                      className={`relative rounded-xl border p-4 text-left transition ${selectedMethod === 'banking' ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      {selectedMethod === 'banking' && (
                        <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                          <CheckCircle2 width={12} height={12} />
                        </span>
                      )}
                      <Landmark width={18} height={18} className="mb-3 text-slate-700" />
                      <p className="text-sm font-semibold text-slate-900">Online Banking</p>
                      <p className="text-xs text-slate-500">BDO, BPI, Landbank, UB</p>
                    </button>

                    <button onClick={() => setSelectedMethod('ewallet')}
                      className={`relative rounded-xl border p-4 text-left transition ${selectedMethod === 'ewallet' ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      {selectedMethod === 'ewallet' && (
                        <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                          <CheckCircle2 width={12} height={12} />
                        </span>
                      )}
                      <Wallet width={18} height={18} className="mb-3 text-slate-700" />
                      <p className="text-sm font-semibold text-slate-900">E-Wallets</p>
                      <p className="text-xs text-slate-500">GCash & Maya Instant</p>
                    </button>

                    <button onClick={() => setSelectedMethod('otc')}
                      className={`relative rounded-xl border p-4 text-left transition ${selectedMethod === 'otc' ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      {selectedMethod === 'otc' && (
                        <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                          <CheckCircle2 width={12} height={12} />
                        </span>
                      )}
                      <Receipt width={18} height={18} className="mb-3 text-slate-700" />
                      <p className="text-sm font-semibold text-slate-900">Over-the-Counter</p>
                      <p className="text-xs text-slate-500">Generate Cashier Slip</p>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="mb-1 font-semibold text-slate-900">CEC Pay</p>
                    <p className="text-xs text-slate-500">Selected: {selectedDescription} · Zero convenience fee via BDO / BPI.</p>

                    <div className="my-5 flex items-center justify-between border-t border-dashed border-slate-300 pt-4">
                      <span className="text-sm text-slate-500">Total Settlement</span>
                      <span className="text-2xl font-bold text-slate-900">{fmt(settleAmount)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button onClick={handleProceed} disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-3 text-sm font-medium text-white hover:bg-[#0d2547] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <Landmark width={16} height={16} /> {submitting ? 'Processing...' : `Proceed with ${methodName} (₱${fmt(settleAmount)})`}
                    </button>
                    <button onClick={handleProceed} disabled={submitting}
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Scan via GCash / Maya
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Itemized Fees & Payment Schedule */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <ListChecks width={17} height={17} className="text-slate-500" /> Itemized Assessment of Fees
                  </span>
                  <span className="text-xs text-slate-400">Curriculum: CMO 25 s.2015</span>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Tuition Fee</p>
                      <p className="text-xs text-slate-400">Academic units — lecture & laboratory</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-slate-800">₱ {fmt(currentBilling?.tuition_fee || 0)}</p>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Miscellaneous & Other Fees</p>
                      <p className="text-xs text-slate-400">Registration, library, laboratory usage, student dues</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-slate-800">₱ {fmt(currentBilling?.misc_fees || 0)}</p>
                  </div>
                  {(currentBilling?.discount || 0) > 0 && (
                    <div className="flex items-start justify-between gap-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Less: Scholarship / Discount</p>
                        <p className="text-xs text-slate-400">Applied institutional discount</p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-emerald-600">- ₱ {fmt(currentBilling?.discount || 0)}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-500">NET ASSESSED AMOUNT</p>
                    <p className="text-xs text-slate-400">{enrollment?.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Regular'} Term Student</p>
                  </div>
                  <p className="text-xl font-bold text-slate-900">₱ {fmt(stats.totalAssessment)}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <TrendingUp width={17} height={17} className="text-slate-500" /> Term Payment Schedule
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">Installment Mode: 5 Tiers</span>
                </div>

                <div className="flex flex-col gap-3">
                  {tiers.map((t, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${t.status === 'received' ? 'border-emerald-100 bg-emerald-50/40' : t.status === 'due' ? 'border-amber-200 bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${t.status === 'received' ? 'bg-emerald-500' : t.status === 'due' ? 'bg-amber-400' : 'bg-slate-100 text-slate-400'}`}>
                          {t.status === 'received' ? <CheckCircle2 width={15} height={15} /> : t.status === 'due' ? <AlertTriangle width={14} height={14} /> : <Clock width={14} height={14} />}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                          <p className="text-xs text-slate-500">{t.settledInfo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">₱ {fmt(t.amount)}</p>
                        <p className={`text-[11px] font-semibold ${t.status === 'received' ? 'text-emerald-600' : t.status === 'due' ? 'text-amber-600' : 'text-slate-400'}`}>
                          {t.status === 'received' ? 'RECEIVED' : t.status === 'due' ? 'DUE FOR SETTLEMENT' : 'UPCOMING'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>Official Exam Permit releases upon settlement of each tiered tranche.</span>
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-blue-600 hover:underline">Permit #BSIT-3A-410</a>
                </div>
              </section>
            </div>

            {/* Transaction History */}
            <section id="history" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <FileText width={17} height={17} className="text-slate-500" /> Payment Transaction History & Status
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Comprehensive record of official cashier postings, online bank settlements, and OR vouchers.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Filter width={13} height={13} /> Filter Term
                  </button>
                  <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Printer width={13} height={13} /> Print Ledger
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wide text-slate-400">
                      <th className="py-2 pr-4">REFERENCE NO.</th>
                      <th className="py-2 pr-4">TRANSACTION DATE</th>
                      <th className="py-2 pr-4">PAYMENT CHANNEL</th>
                      <th className="py-2 pr-4">PARTICULARS / DESCRIPTION</th>
                      <th className="py-2 pr-4 text-right">AMOUNT</th>
                      <th className="py-2 pr-4">VERIFICATION & RECEIPT STATUS</th>
                      <th className="py-2 pl-4 text-right">OFFICIAL RECEIPT (OR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {payments.length > 0 ? payments.map((p) => {
                      const payBilling = billing.find(b => b.id === p.billing_id)
                      return (
                        <tr key={p.id}>
                          <td className="py-3 pr-4 font-semibold text-slate-800">{p.reference_no || `CEC-PAY-${p.id.slice(0, 8).toUpperCase()}`}</td>
                          <td className="py-3 pr-4 text-slate-600">
                            {new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}<br />
                            <span className="text-xs text-slate-400">{new Date(p.paid_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            <span className="flex items-center gap-1.5">
                              {p.method.includes('Bank') ? <Landmark width={13} height={13} className="text-slate-400" /> : <Wallet width={13} height={13} className="text-slate-400" />}
                              {p.method}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">Tuition & Assessment Installment{payBilling ? ` (${payBilling.semester})` : ''}</td>
                          <td className="py-3 pr-4 text-right font-semibold text-slate-800">₱ {fmt(p.amount)}</td>
                          <td className="py-3 pr-4">
                            {p.verified ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                                <CheckCircle2 width={12} height={12} /> Payment Received · Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                                <AlertTriangle width={12} height={12} /> Awaiting Settlement · Unpaid
                              </span>
                            )}
                          </td>
                          <td className="py-3 pl-4 text-right">
                            {p.verified ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                                OR #{p.reference_no || '—'} <ExternalLink width={12} height={12} />
                              </span>
                            ) : (
                              <button onClick={() => scrollTo('settle')} className="inline-flex items-center gap-1 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0d2547] transition-colors">
                                Settle Now <ExternalLink width={12} height={12} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-sm text-slate-400">No transactions yet. Submit a payment above to get started.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>Official receipts and exam clearances are digitally signed by the Accounting Office.</span>
                <span>
                  Showing {payments.length} transaction{payments.length === 1 ? '' : 's'} · Cashier:
                  <a href="mailto:cashier@cec.edu.ph" className="font-medium text-blue-600 hover:underline">cashier@cec.edu.ph</a>
                </span>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-6 flex items-center justify-between px-1 pb-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                © 2026 Cebu Eastern College. All Systems Operational
              </span>
            </footer>
          </>
        )}
      </div>
    </StudentLayout>
  )
}
