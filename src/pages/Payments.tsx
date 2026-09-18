import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

interface BillingAccount {
  id: string
  student_id: string
  total_amount: number
  total_paid: number
  balance: number
  academic_year: string
  semester: string
  fee_breakdown: Record<string, number> | null
}

interface PaymentRecord {
  id: string
  billing_id: string
  amount: number
  payment_method: string
  reference_number: string
  status: string
  notes: string
  created_at: string
}

interface PaymentSchedule {
  tier: number
  label: string
  dueDate: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'upcoming'
}

export default function Payments() {
  const user = useAuthStore((s) => s.user)
  const notify = useNotification()
  const [billing, setBilling] = useState<BillingAccount[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [payAmount, setPayAmount] = useState<string>('')
  const [payMethod, setPayMethod] = useState('gcash')
  const [payRef, setPayRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState<string>('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      const [bRes, pRes] = await Promise.all([
        supabase.from('billing_accounts').select('*').eq('student_id', user.id),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
      ])
      if (bRes.data) setBilling(bRes.data)
      if (pRes.data) setPayments(pRes.data)
      if (bRes.data?.[0]) setSelectedBilling(bRes.data[0].id)
      setLoading(false)
    }
    load()
  }, [user])

  const totalDue = useMemo(() => billing.reduce((s, b) => s + (b.total_amount || 0), 0), [billing])
  const totalPaid = useMemo(() => payments.filter(p => p.status === 'verified').reduce((s, p) => s + (p.amount || 0), 0), [payments])
  const totalBalance = totalDue - totalPaid

  const currentBilling = billing.find(b => b.id === selectedBilling)

  const feeBreakdown = currentBilling?.fee_breakdown as Record<string, number> | null
  const feeItems = feeBreakdown ? Object.entries(feeBreakdown).map(([name, amount]) => ({ name, amount })) : [
    { name: 'Tuition Fee', amount: Math.round(totalDue * 0.45) },
    { name: 'Miscellaneous Fee', amount: Math.round(totalDue * 0.25) },
    { name: 'Laboratory Fee', amount: Math.round(totalDue * 0.15) },
    { name: 'Library Fee', amount: Math.round(totalDue * 0.08) },
    { name: 'Student Activities Fee', amount: Math.round(totalDue * 0.07) },
  ]

  const paymentSchedule: PaymentSchedule[] = [
    { tier: 1, label: 'Enrollment', dueDate: 'Before Enrollment', amount: Math.round(totalDue * 0.25), status: totalPaid >= totalDue * 0.25 ? 'paid' : 'pending' },
    { tier: 2, label: '1st Payment', dueDate: 'Month 1', amount: Math.round(totalDue * 0.1875), status: totalPaid >= totalDue * 0.4375 ? 'paid' : 'pending' },
    { tier: 3, label: '2nd Payment', dueDate: 'Month 2', amount: Math.round(totalDue * 0.1875), status: totalPaid >= totalDue * 0.625 ? 'paid' : 'pending' },
    { tier: 4, label: '3rd Payment', dueDate: 'Month 3', amount: Math.round(totalDue * 0.1875), status: totalPaid >= totalDue * 0.8125 ? 'paid' : 'upcoming' },
    { tier: 5, label: 'Final Payment', dueDate: 'Month 4', amount: Math.round(totalDue * 0.1875), status: totalPaid >= totalDue ? 'paid' : 'upcoming' },
  ]

  const handleSubmitPayment = async () => {
    if (!user || !selectedBilling || !payAmount || Number(payAmount) <= 0) {
      notify.error({ title: 'Invalid', message: 'Please enter a valid amount.' })
      return
    }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('payments').insert({
        billing_id: selectedBilling,
        amount: Number(payAmount),
        payment_method: payMethod,
        reference_number: payRef || null,
        status: 'pending',
        notes: '',
      })
      if (error) throw error
      notify.success({ title: 'Payment Submitted', message: 'Your payment is pending verification.' })
      setPayAmount('')
      setPayRef('')
      const { data: pRes } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
      if (pRes) setPayments(pRes)
    } catch (err: any) {
      notify.error({ title: 'Error', message: err.message || 'Failed to submit payment.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <StudentLayout title="Payments">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#14213D] border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout title="Payments">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
          <div className="text-[11px] text-[#7A8299] mb-1">Total Assessment</div>
          <div className="text-[18px] font-bold text-[#14213D]">₱{totalDue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
          <div className="text-[11px] text-[#7A8299] mb-1">Total Paid</div>
          <div className="text-[18px] font-bold text-[#0F9D58]">₱{totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
          <div className="text-[11px] text-[#7A8299] mb-1">Remaining Balance</div>
          <div className="text-[18px] font-bold text-[#E4483F]">₱{totalBalance.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
          <div className="text-[11px] text-[#7A8299] mb-1">Due Alert</div>
          <div className={`text-[14px] font-bold ${totalBalance > 0 ? 'text-[#E4483F]' : 'text-[#0F9D58]'}`}>
            {totalBalance > 0 ? `${paymentSchedule.filter(s => s.status === 'pending').length} Upcoming` : 'All Clear'}
          </div>
          <div className="text-[11px] text-[#9AA1B5] mt-0.5">Next: {paymentSchedule.find(s => s.status === 'pending')?.label || 'None'}</div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-6">
        <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Record a Payment</h2>
        <p className="text-[12px] text-[#7A8299] mb-4">Submit proof of payment for verification by the Accounting Office.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Amount (₱)</label>
            <input type="number" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4] focus:ring-1 focus:ring-[#2F5DD4]/20"
              placeholder="0.00" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Payment Method</label>
            <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4] focus:ring-1 focus:ring-[#2F5DD4]/20">
              <option value="gcash">GCash</option>
              <option value="maya">Maya</option>
              <option value="online_banking">Online Banking</option>
              <option value="otc">Over-the-Counter</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Reference Number</label>
            <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4] focus:ring-1 focus:ring-[#2F5DD4]/20"
              placeholder="Optional" />
          </div>
        </div>
        <button onClick={handleSubmitPayment} disabled={submitting || !payAmount || Number(payAmount) <= 0}
          className="px-5 py-2 rounded-lg bg-[#2F5DD4] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>

      {/* Itemized Fees */}
      <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-6">
        <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Itemized Fees</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E6E8EE]">
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Fee Type</th>
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeItems.map(fee => (
                <tr key={fee.name} className="border-b border-[#F0F2F7] last:border-0">
                  <td className="py-2.5 text-[12.5px] text-[#14213D]">{fee.name}</td>
                  <td className="py-2.5 text-[12.5px] font-medium text-[#14213D] text-right">₱{fee.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#E6E8EE]">
                <td className="pt-2.5 text-[13px] font-bold text-[#14213D]">Total</td>
                <td className="pt-2.5 text-[13px] font-bold text-[#14213D] text-right">₱{totalDue.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-6">
        <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Payment Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E6E8EE]">
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Tier</th>
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Description</th>
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Due Date</th>
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2 text-right">Amount</th>
                <th className="text-[11px] font-semibold text-[#7A8299] pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map(s => (
                <tr key={s.tier} className="border-b border-[#F0F2F7] last:border-0">
                  <td className="py-2.5 text-[12px] text-[#7A8299]">Tier {s.tier}</td>
                  <td className="py-2.5 text-[12.5px] font-medium text-[#14213D]">{s.label}</td>
                  <td className="py-2.5 text-[12px] text-[#525A6E]">{s.dueDate}</td>
                  <td className="py-2.5 text-[12.5px] font-medium text-[#14213D] text-right">₱{s.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.status === 'paid' ? 'bg-[#E6F7ED] text-[#0F9D58]' : s.status === 'overdue' ? 'bg-[#FDECEB] text-[#E4483F]' : s.status === 'pending' ? 'bg-[#FFF8E6] text-[#D4A017]' : 'bg-[#EEF1F8] text-[#7A8299]'}`}>
                      {s.status === 'paid' ? 'Paid' : s.status === 'overdue' ? 'Overdue' : s.status === 'pending' ? 'Pending' : 'Upcoming'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
        <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Payment Transaction History</h2>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E6E8EE]">
                  <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Date</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Method</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Reference</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] pb-2 text-right">Amount</th>
                  <th className="text-[11px] font-semibold text-[#7A8299] pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-[#F0F2F7] last:border-0">
                    <td className="py-2.5 text-[12px] text-[#525A6E]">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-2.5 text-[12px] text-[#14213D] capitalize">{p.payment_method?.replace('_', ' ') || '—'}</td>
                    <td className="py-2.5 text-[12px] text-[#525A6E]">{p.reference_number || '—'}</td>
                    <td className="py-2.5 text-[12.5px] font-medium text-[#14213D] text-right">₱{p.amount.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${p.status === 'verified' ? 'bg-[#E6F7ED] text-[#0F9D58]' : p.status === 'rejected' ? 'bg-[#FDECEB] text-[#E4483F]' : 'bg-[#FFF8E6] text-[#D4A017]'}`}>
                        {p.status === 'verified' ? 'Verified' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-full bg-[#EEF1F8] flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA1B5" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <p className="text-[12px] text-[#9AA1B5]">No payment transactions yet</p>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
