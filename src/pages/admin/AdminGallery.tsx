import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface GalleryItem { id: string; title: string; caption: string; image_url: string; category: string; is_published: boolean; sort_order: number; created_at: string }

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('general')
  const [caption, setCaption] = useState('')
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('sort_order')
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files; if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fileName = `gallery/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('gallery').upload(fileName, file)
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
        const { data } = await supabase.from('gallery').insert([{ image_url: publicUrl, category, caption, is_published: true }]).select().single()
        if (data) await logAdminActivity('created', 'gallery', data.id, { title: data.caption || file.name, category })
      }
    }
    setCaption(''); setUploading(false); load()
  }

  async function remove(item: GalleryItem) {
    if (!confirm('Delete this image?')) return
    try {
      const urlParts = item.image_url.split('/')
      const bucketIndex = urlParts.indexOf('gallery')
      if (bucketIndex >= 0) {
        const path = urlParts.slice(bucketIndex + 1).join('/').split('?')[0]
        await supabase.storage.from('gallery').remove([path])
      }
      const { error } = await supabase.from('gallery').delete().eq('id', item.id)
      if (error) throw error
      await logAdminActivity('deleted', 'gallery', item.id, { title: item.caption, category: item.category })
      addNotification({ type: 'success', title: 'Deleted' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  async function togglePublish(item: GalleryItem) {
    try {
      const newPublished = !item.is_published
      const { error } = await supabase.from('gallery').update({ is_published: newPublished }).eq('id', item.id)
      if (error) throw error
      await logAdminActivity(newPublished ? 'published' : 'unpublished', 'gallery', item.id, { title: item.caption, category: item.category })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const categories = ['general', 'campus', 'events', 'sports', 'graduation', 'students', 'faculty', 'activities']

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-6">Gallery</h1>

      {/* Upload */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Optional caption" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E4E8C] file:text-white file:text-sm file:cursor-pointer" />
          </div>
          {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
      </div>

      {/* Grid */}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
      : items.length === 0 ? <div className="bg-white/90 backdrop-blur-sm rounded-xl p-12 text-center text-gray-400 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">No images yet.</div>
      : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-hidden group relative">
              <img src={item.image_url} alt={item.caption || item.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                <button onClick={() => togglePublish(item)} className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white ${item.is_published ? 'bg-green-500' : 'bg-gray-500'}`}>{item.is_published ? 'Published' : 'Hidden'}</button>
                <button onClick={() => remove(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600">Delete</button>
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                {item.caption && <div className="text-sm text-gray-700 truncate">{item.caption}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
