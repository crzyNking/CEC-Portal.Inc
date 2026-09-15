import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface SchoolInfo { id: string; school_name: string; school_description: string; address: string; phone: string; email: string; office_hours: string; facebook: string; website_logo: string; website_favicon: string; footer_text: string }

export default function AdminSchoolInfo() {
  const [settings, setSettings] = useState<Partial<SchoolInfo>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await supabase.from('school_settings').select('*').limit(1).single()
      if (data) setSettings(data)
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load school settings', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    try {
      if (settings.id) {
        const { error } = await supabase.from('school_settings').update(settings).eq('id', settings.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('school_settings').insert([settings]).select().single()
        if (error) throw error
        if (data) setSettings(data)
      }
      await logAdminActivity('saved', 'school_settings', settings.id, { school_name: settings.school_name })
      addNotification({ type: 'success', title: 'School settings saved' })
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('cms-images').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('cms-images').getPublicUrl(fileName)
      setSettings({ ...settings!, website_logo: publicUrl })
      addNotification({ type: 'success', title: 'Logo uploaded' })
    } catch (err) {
      addNotification({ type: 'error', title: 'Logo upload failed', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-6">School Information</h1>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] max-w-3xl">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">School Name</label><input value={settings.school_name || ''} onChange={(e) => setSettings({ ...settings, school_name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={settings.school_description || ''} onChange={(e) => setSettings({ ...settings, school_description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label><input value={settings.office_hours || ''} onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label><input value={settings.facebook || ''} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">School Logo</label><input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E4E8C] file:text-white file:text-sm file:cursor-pointer" /></div>
          {settings.website_logo && <img src={settings.website_logo} alt="Logo" className="h-16 object-contain" />}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label><textarea value={settings.footer_text || ''} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div className="mt-6"><button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button></div>
      </div>
    </div>
  )
}
