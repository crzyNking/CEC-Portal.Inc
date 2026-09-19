import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Log { id: string; user_id: string | null; action: string; entity_type: string; entity_id: string | null; details: Record<string, unknown> | null; created_at: string }

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(100)
    setLogs(data || []); setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Activity Logs</h1>
        <button onClick={load} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Refresh</button>
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
      : logs.length === 0 ? <div className="bg-white/90 backdrop-blur-sm rounded-xl p-12 text-center text-gray-400 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">No activity logs yet.</div>
      : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Details</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.action.includes('create') ? 'bg-green-100 text-green-700' :
                      log.action.includes('update') ? 'bg-blue-100 text-blue-700' :
                      log.action.includes('delete') ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{log.entity_type || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{log.details ? JSON.stringify(log.details) : '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
