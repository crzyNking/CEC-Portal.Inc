import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface Service { id: string; title: string; description: string; icon: string; image_url: string; is_active: boolean; sort_order: number; created_at: string }

const empty: Partial<Service> = { title: '', description: '', icon: '', image_url: '', is_active: true, sort_order: 0 }

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Service> | null>(null)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('services').select('*').order('sort_order')
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    if (!editing.title?.trim()) {
      addNotification({ type: 'warning', title: 'Title is required' })
      setSaving(false)
      return
    }
    try {
      if (editing.id) {
        const { error } = await supabase.from('services').update(editing).eq('id', editing.id)
        if (error) throw error
        await logAdminActivity('updated', 'service', editing.id, { title: editing.title })
      } else {
        const { data, error } = await supabase.from('services').insert([editing]).select().single()
        if (error) throw error
        if (data) await logAdminActivity('created', 'service', data.id, { title: data.title })
      }
      addNotification({ type: 'success', title: 'Saved successfully' })
      setEditing(null)
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete?')) return
    try {
      const item = items.find((s) => s.id === id)
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      await logAdminActivity('deleted', 'service', id, { title: item?.title })
      addNotification({ type: 'success', title: 'Deleted' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-gray-900">{editing.id ? 'Edit' : 'New'} Service</h1><button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-3xl">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG path)</label><input value={editing.icon || ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label><input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_active || false} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Active</span></label>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#13275c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3570] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-gray-900">Services</h1><button onClick={() => setEditing({ ...empty })} className="px-4 py-2 bg-[#13275c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3570]">+ New</button></div>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#13275c]/30 border-t-[#13275c] rounded-full animate-spin" /></div>
      : items.length === 0 ? <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No services yet.</div>
      : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Title</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.title}</td>
                  <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-right space-x-2"><button onClick={() => setEditing(s)} className="text-[#13275c] hover:underline text-xs font-medium">Edit</button><button onClick={() => remove(s.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
