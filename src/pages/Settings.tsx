import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { usePreferencesStore, type Theme } from '../store/preferencesStore'
import { useActivityStore } from '../store/activityStore'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

export function Settings() {
  const { user } = useAuthStore()
  const { preferences, fetchPreferences, updatePreferences } = usePreferencesStore()
  const { logActivity } = useActivityStore()
  const notify = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchPreferences(user.id)
    }
  }, [user, fetchPreferences])

  const handleThemeChange = async (theme: Theme) => {
    if (!user) return
    await updatePreferences(user.id, { theme })
    await logActivity(user.id, 'theme_changed', { theme })
    notify.success({ title: 'Theme updated', message: `Switched to ${theme} mode` })
  }

  const handleNotificationToggle = async (key: 'email_notifications' | 'push_notifications' | 'marketing_emails', value: boolean) => {
    if (!user) return
    await updatePreferences(user.id, { [key]: value })
    await logActivity(user.id, 'preference_updated', { key, value })
    notify.success({ title: 'Preference updated', message: 'Your settings have been saved' })
  }

  const themes: { value: Theme; label: string; description: string }[] = [
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
    { value: 'light', label: 'Light', description: 'Bright and clean' },
    { value: 'system', label: 'System', description: 'Follow your device' },
  ]

  const notifications = [
    { key: 'email_notifications' as const, label: 'Email Notifications', description: 'Receive email updates about your account' },
    { key: 'push_notifications' as const, label: 'Push Notifications', description: 'Receive push notifications in your browser' },
    { key: 'marketing_emails' as const, label: 'Marketing Emails', description: 'Receive emails about new features and tips' },
  ]

  return (
    <StudentLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Theme Section */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 transition-colors">
            <h2 className="text-lg font-semibold text-[#0B1F3A] mb-1">Appearance</h2>
            <p className="text-sm text-gray-500 mb-6">Customize how the app looks on your device</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`relative p-4 rounded-xl border transition-all duration-200 ${
                    preferences?.theme === theme.value
                      ? 'border-[#1E4E8C]/50 bg-[#1E4E8C]/10'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-16 rounded-lg mb-3 ${
                    theme.value === 'dark' ? 'bg-[#102A43] border border-white/10' :
                    theme.value === 'light' ? 'bg-gray-100 border border-gray-200' :
                    'bg-gradient-to-r from-[#102A43] to-gray-100 border border-white/10'
                  }`} />
                  <p className="text-sm font-medium text-gray-900">{theme.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
                  {preferences?.theme === theme.value && (
                    <div className="absolute top-3 right-3">
                      <svg className="h-5 w-5 text-[#1E4E8C]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 transition-colors">
            <h2 className="text-lg font-semibold text-[#0B1F3A] mb-1">Notifications</h2>
            <p className="text-sm text-gray-500 mb-6">Manage how you receive updates</p>

            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(notif.key, !(preferences?.[notif.key] ?? true))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences?.[notif.key] ?? true ? 'bg-[#1E4E8C]' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences?.[notif.key] ?? true ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 transition-colors">
            <h2 className="text-lg font-semibold text-[#0B1F3A] mb-1">Account</h2>
            <p className="text-sm text-gray-500 mb-6">Manage your account settings</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="flex w-full items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E4E8C]/10">
                    <svg className="h-5 w-5 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Edit Profile</p>
                    <p className="text-xs text-gray-500">Update your name and avatar</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
