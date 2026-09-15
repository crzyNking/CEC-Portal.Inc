import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface HomepageContent { id: string; hero_title: string; hero_subtitle: string; hero_description: string; hero_image: string; hero_button_text: string; hero_button_url: string; hero_secondary_text: string; hero_secondary_url: string; featured_news: boolean; featured_events: boolean; featured_enrollment: boolean }

export default function AdminHomepage() {
  const [settings, setSettings] = useState<Partial<HomepageContent>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await supabase.from('homepage_content').select('*').limit(1).single()
      if (data) setSettings(data)
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load homepage content', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    try {
      if (settings.id) {
        const { error } = await supabase.from('homepage_content').update(settings).eq('id', settings.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('homepage_content').insert([settings]).select().single()
        if (error) throw error
        if (data) setSettings(data)
      }
      await logAdminActivity('saved', 'homepage', settings.id, { hero_title: settings.hero_title })
      addNotification({ type: 'success', title: 'Homepage content saved' })
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const fileName = `hero-${Date.now()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('cms-images').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('cms-images').getPublicUrl(fileName)
      setSettings({ ...settings!, hero_image: publicUrl })
      addNotification({ type: 'success', title: 'Hero image uploaded' })
    } catch (err) {
      addNotification({ type: 'error', title: 'Image upload failed', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-6">Homepage Content</h1>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] max-w-3xl">
        <h2 className="font-bold text-gray-800 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={settings.hero_title || ''} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label><input value={settings.hero_subtitle || ''} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={settings.hero_description || ''} onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E4E8C] file:text-white file:text-sm file:cursor-pointer" /></div>
          {settings.hero_image && <img src={settings.hero_image} alt="" className="w-60 h-32 object-cover rounded-lg" />}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Button</label><input value={settings.hero_button_text || ''} onChange={(e) => setSettings({ ...settings, hero_button_text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary URL</label><input value={settings.hero_button_url || ''} onChange={(e) => setSettings({ ...settings, hero_button_url: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button</label><input value={settings.hero_secondary_text || ''} onChange={(e) => setSettings({ ...settings, hero_secondary_text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Secondary URL</label><input value={settings.hero_secondary_url || ''} onChange={(e) => setSettings({ ...settings, hero_secondary_url: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <h2 className="font-bold text-gray-800 mt-8 mb-4">Featured Sections</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.featured_news || false} onChange={(e) => setSettings({ ...settings, featured_news: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Show Featured News</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.featured_events || false} onChange={(e) => setSettings({ ...settings, featured_events: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Show Featured Events</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.featured_enrollment || false} onChange={(e) => setSettings({ ...settings, featured_enrollment: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Show Enrollment Banner</span></label>
        </div>

        <div className="mt-6"><button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button></div>
      </div>
    </div>
  )
}
