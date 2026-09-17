import AdminNews from './AdminNews'
import AdminEvents from './AdminEvents'
import AdminAnnouncements from './AdminAnnouncements'

export default function AdminOther() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Other Admin</h1>
          <p className="text-gray-500 text-sm">News, events, and announcements management.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
          <h2 className="font-bold text-gray-800 mb-4">News Management</h2>
          <AdminNews />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
          <h2 className="font-bold text-gray-800 mb-4">Events Management</h2>
          <AdminEvents />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
          <h2 className="font-bold text-gray-800 mb-4">Announcements Management</h2>
          <AdminAnnouncements />
        </div>
      </div>
    </div>
  )
}