import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import ConfirmModal from '../../components/ConfirmModal'

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

interface StudentRow { id: string; email: string | null; full_name: string | null; }

export default function AdminAccounting() {
  const [tab, setTab] = useState<'billing' | 'payments' | 'reports'>('billing')
  const [billing, setBilling] = useState<BillingAccount[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [billForm, setBillForm] = useState({ student_id: '', enrollment_id: '', student_name: '', level: '', school_year: '', semester: '', tuition_fee: 0, misc_fees: 0, discount: 0 })
  const [payForm, setPayForm] = useState({ billing_id: '', amount: 0, method: 'cash', reference_no: '' })
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => {} })
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { user } = useAuthStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [billRes, payRes, stuRes] = await Promise.all([
        supabase.from('billing_accounts').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('paid_at', { ascending: false }),
        supabase.from('profiles').select('id, email, full_name, role').eq('role', 'student'),
      ])
      if (billRes.error) throw billRes.error
      if (payRes.error) throw payRes.error
      if (stuRes.error) throw stuRes.error
      setBilling(billRes.data || [])
      setPayments(payRes.data || [])
      setStudents(stuRes.data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => { load() }, [load])

  const filteredBilling = billing.filter((b) => {
    const q = search.toLowerCase()
    return (!q || b.student_name.toLowerCase().includes(q) || b.student_id?.includes(q)) &&
      (statusFilter === 'all' || b.status === statusFilter)
  })

  const getStudent = (id: string | null) => students.find(s => s.id === id)

  const addBilling = async (e: React.FormEvent) => {
    e.preventDefault()
    const { tuition_fee, misc_fees, discount } = billForm
    const total = tuition_fee + misc_fees - discount
    try {
      const { error } = await supabase.from('billing_accounts').insert({
        ...billForm, total_due: total, balance: total, status: 'pending',
      })
      if (error) throw error
      await logAdminActivity('created', 'billing_account', undefined, { student: billForm.student_name })
      addNotification({ type: 'success', title: 'Billing account created' })
      setBillForm({ student_id: '', enrollment_id: '', student_name: '', level: '', school_year: '', semester: '', tuition_fee: 0, misc_fees: 0, discount: 0 })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('payments').insert({
        ...payForm, paid_at: new Date().toISOString(), created_by: user?.id,
      })
      if (error) throw error
      await logAdminActivity('created', 'payment', undefined, { amount: payForm.amount })
      addNotification({ type: 'success', title: 'Payment recorded' })
      setPayForm({ billing_id: '', amount: 0, method: 'cash', reference_no: '' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to add', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const verifyPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase.from('payments').update({ verified: true, verified_by: user?.id, verified_at: new Date().toISOString() }).eq('id', paymentId)
      if (error) throw error
      // Also update billing balance
      const { data: pay } = await supabase.from('payments').select('billing_id, amount').eq('id', paymentId).single()
      if (pay) {
        const { data: bill } = await supabase.from('billing_accounts').select('balance, status').eq('id', pay.billing_id).single()
        if (bill) {
          const newBal = Math.max(0, bill.balance - pay.amount)
          const newStatus = newBal === 0 ? 'paid' : 'partial'
          await supabase.from('billing_accounts').update({ balance: newBal, status: newStatus }).eq('id', pay.billing_id)
        }
      }
      await logAdminActivity('verified', 'payment', paymentId)
      addNotification({ type: 'success', title: 'Payment verified' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to verify', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const unverifyPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase.from('payments').update({ verified: false, verified_by: null, verified_at: null }).eq('id', paymentId)
      if (error) throw error
      await logAdminActivity('unverified', 'payment', paymentId)
      addNotification({ type: 'success', title: 'Payment unverified' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to unverify', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  const tabs = [
    { key: 'billing' as const, label: 'Billing Accounts' },
    { key: 'payments' as const, label: 'Payments & Verification' },
    { key: 'reports' as const, label: 'Financial Reports' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Accounting Admin</h1>
          <p className="text-gray-500 text-sm">Student billing, tuition, payments, and financial reports.</p>
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

      {tab === 'billing' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-gray-800">Billing Accounts ({filteredBilling.length})</h2>
              <div className="flex gap-2">
                <input value={search} onChange={(ev) => setSearch(ev.target.value)} placeholder="Search student..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
                <select value={statusFilter} onChange={(ev) => setStatusFilter(ev.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Level / SY / Sem</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Total Due</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Balance</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBilling.map((b) => {
                    const s = getStudent(b.student_id)
                    const statusColors: Record<string, string> = {
                      paid: 'bg-green-100 text-green-700',
                      pending: 'bg-amber-100 text-amber-700',
                      partial: 'bg-blue-100 text-blue-700',
                      overdue: 'bg-red-100 text-red-700',
                    }
                    return (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{b.student_name || s?.full_name || b.student_id}</div>
                          <div className="text-xs text-gray-500">{s?.email || ''}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.level} · {b.school_year} · {b.semester}</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#0B1F3A]">₱{b.total_due.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold text-red-600">₱{b.balance.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Create Billing Account</h2>
            <form onSubmit={addBilling} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={billForm.student_id} onChange={(ev) => {
                  const st = students.find(s => s.id === ev.target.value)
                  setBillForm({ ...billForm, student_id: ev.target.value, student_name: st?.full_name || '', enrollment_id: st?.id || '' })
                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]">
                  <option value="">Select student</option>
                  {students.map((st) => <option key={st.id} value={st.id}>{st.full_name || st.email}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <input value={billForm.level} onChange={(ev) => setBillForm({ ...billForm, level: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="College" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input value={billForm.semester} onChange={(ev) => setBillForm({ ...billForm, semester: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="1st Sem" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                <input value={billForm.school_year} onChange={(ev) => setBillForm({ ...billForm, school_year: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="2025-2026" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee</label>
                  <input type="number" step="0.01" value={billForm.tuition_fee} onChange={(ev) => setBillForm({ ...billForm, tuition_fee: Number(ev.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Misc. Fees</label>
                  <input type="number" step="0.01" value={billForm.misc_fees} onChange={(ev) => setBillForm({ ...billForm, misc_fees: Number(ev.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <input type="number" step="0.01" value={billForm.discount} onChange={(ev) => setBillForm({ ...billForm, discount: Number(ev.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Create Account</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-800 mb-3">Payments ({payments.length})</h2>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Method</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Verified</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const bill = billing.find(b => b.id === p.billing_id)
                    const s = getStudent(bill?.student_id ?? null)
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-800">{bill?.student_name || s?.full_name || '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#0B1F3A]">₱{p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm capitalize">{p.method}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{p.reference_no || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(p.paid_at).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {p.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.verified ? (
                            <button onClick={() => unverifyPayment(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Unverify</button>
                          ) : (
                            <button onClick={() => verifyPayment(p.id)} className="text-green-500 hover:text-green-700 text-xs font-medium">Verify</button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Record Payment</h2>
            <form onSubmit={addPayment} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Account</label>
                <select value={payForm.billing_id} onChange={(ev) => setPayForm({ ...payForm, billing_id: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" required>
                  <option value="">Select billing account</option>
                  {billing.map((b) => <option key={b.id} value={b.id}>{b.student_name} — ₱{b.balance.toLocaleString()} balance ({b.status})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input type="number" step="0.01" value={payForm.amount} onChange={(ev) => setPayForm({ ...payForm, amount: Number(ev.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select value={payForm.method} onChange={(ev) => setPayForm({ ...payForm, method: ev.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference No. (optional)</label>
                <input value={payForm.reference_no} onChange={(ev) => setPayForm({ ...payForm, reference_no: ev.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Transaction ID / Check No." />
              </div>
              <button type="submit" className="w-full py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">Record Payment</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="text-3xl font-bold text-[#1E4E8C]">₱{billing.reduce((s, b) => s + b.total_due, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Billed</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="text-3xl font-bold text-green-600">₱{payments.filter(p => p.verified).reduce((s, p) => s + p.amount, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Collected (Verified)</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="text-3xl font-bold text-red-600">₱{billing.reduce((s, b) => s + b.balance, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Outstanding Balance</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
              <div className="text-3xl font-bold text-blue-600">{payments.filter(p => !p.verified).length}</div>
              <div className="text-sm text-gray-500">Pending Verification</div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
            <h2 className="font-bold text-gray-800 mb-4">Payments by Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['cash','bank_transfer','gcash','maya','check'].map((m) => {
                const total = payments.filter(p => p.verified && p.method === m).reduce((s, p) => s + p.amount, 0)
                const count = payments.filter(p => p.verified && p.method === m).length
                return (
                  <div key={m} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-sm text-gray-500 capitalize">{m.replace('_', ' ')}</div>
                    <div className="text-lg font-bold text-[#1E4E8C]">₱{total.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{count} transaction{count !== 1 ? 's' : ''}</div>
                  </div>
                )
              })}
            </div>
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