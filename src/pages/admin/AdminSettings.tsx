import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface WebsiteSettings { id: string; announcement_bar: boolean; news_section: boolean; events_section: boolean; enrollment_section: boolean; programs_section: boolean; gallery_section: boolean; services_section: boolean; contact_section: boolean; maintenance_mode: boolean; maintenance_message: string }

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await supabase.from('website_settings').select('*').limit(1).single()
      if (data) setSettings(data)
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load website settings', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    try {
      if (settings.id) {
        const { error } = await supabase.from('website_settings').update(settings).eq('id', settings.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('website_settings').insert([settings]).select().single()
        if (error) throw error
        if (data) setSettings(data)
      }
      await logAdminActivity('saved', 'website_settings', settings.id)
      addNotification({ type: 'success', title: 'Website settings saved' })
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  const sections = [
    { key: 'announcement_bar', label: 'Announcement Bar' },
    { key: 'news_section', label: 'News Section' },
    { key: 'events_section', label: 'Events Section' },
    { key: 'enrollment_section', label: 'Enrollment Section' },
    { key: 'programs_section', label: 'Programs Section' },
    { key: 'gallery_section', label: 'Gallery Section' },
    { key: 'services_section', label: 'Services Section' },
    { key: 'contact_section', label: 'Contact Section' },
  ] as const

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-6">Website Settings</h1>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] max-w-3xl">
        <h2 className="font-bold text-gray-800 mb-4">Website Sections</h2>
        <div className="space-y-3 mb-8">
          {sections.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-700">{s.label}</span>
              <button onClick={() => setSettings({ ...settings, [s.key]: !settings[s.key] })} className={`px-4 py-1.5 rounded-full text-xs font-medium ${settings[s.key] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{settings[s.key] ? 'ON' : 'OFF'}</button>
            </div>
          ))}
        </div>

        <h2 className="font-bold text-gray-800 mb-4">Maintenance Mode</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Status:</span>
            <button onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })} className={`px-4 py-2 rounded-lg text-sm font-medium ${settings.maintenance_mode ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{settings.maintenance_mode ? 'ON' : 'OFF'}</button>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label><textarea value={settings.maintenance_message || ''} onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div className="mt-6"><button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button></div>
      </div>
    </div>
  )
}
