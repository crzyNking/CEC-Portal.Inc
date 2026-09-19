import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface SchoolSettings {
  id: string
  school_name: string
  school_description: string
  address: string
  phone: string
  email: string
  office_hours: string
  facebook: string
  website_logo: string
  website_favicon: string
  footer_text: string
}

interface WebsiteSettings {
  id: string
  announcement_bar: boolean
  news_section: boolean
  events_section: boolean
  enrollment_section: boolean
  programs_section: boolean
  gallery_section: boolean
  services_section: boolean
  contact_section: boolean
  maintenance_mode: boolean
  maintenance_message: string
}

interface HomepageContent {
  id: string
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_image: string
  hero_button_text: string
  hero_button_url: string
  hero_secondary_text: string
  hero_secondary_url: string
  featured_news: boolean
  featured_events: boolean
  featured_enrollment: boolean
}

interface SettingsState {
  school: SchoolSettings | null
  website: WebsiteSettings | null
  homepage: HomepageContent | null
  loading: boolean
  error: boolean
}

let globalSettings: SettingsState = { school: null, website: null, homepage: null, loading: true, error: false }
let listeners: Array<() => void> = []
let loadingPromise: Promise<void> | null = null
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null
let reloadTimer: ReturnType<typeof setTimeout> | null = null

function notifyListeners() {
  listeners.forEach((l) => l())
}

async function fetchAll(): Promise<{ school: SchoolSettings | null; website: WebsiteSettings | null; homepage: HomepageContent | null; error: boolean } | null> {
  try {
    const [schoolRes, websiteRes, homepageRes] = await Promise.all([
      supabase.from('school_settings').select('*').limit(1).maybeSingle(),
      supabase.from('website_settings').select('*').limit(1).maybeSingle(),
      supabase.from('homepage_content').select('*').limit(1).maybeSingle(),
    ])

    if (schoolRes.error || websiteRes.error || homepageRes.error) {
      return null
    }
    return {
      school: schoolRes.data,
      website: websiteRes.data,
      homepage: homepageRes.data,
      error: false,
    }
  } catch {
    return null
  }
}

function setupRealtime() {
  if (realtimeChannel || typeof window === 'undefined') return

  realtimeChannel = supabase
    .channel('cec-content-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'school_settings' }, scheduleReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'website_settings' }, scheduleReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'homepage_content' }, scheduleReload)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        supabase.removeChannel(realtimeChannel!)
        realtimeChannel = null
        setTimeout(() => setupRealtime(), 5000)
      }
    })
}

function scheduleReload() {
  if (reloadTimer) clearTimeout(reloadTimer)
  reloadTimer = setTimeout(() => { reloadSettings() }, 500)
}

async function reloadSettings() {
  const data = await fetchAll()
  if (data && !data.error) {
    globalSettings = { ...data, loading: false }
    notifyListeners()
  }
}

export function useSettings() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((t) => t + 1)
    listeners.push(listener)
    return () => { listeners = listeners.filter((l) => l !== listener) }
  }, [])

  useEffect(() => {
    if (globalSettings.school !== null || globalSettings.error) return
    if (!loadingPromise) {
      loadingPromise = loadSettings()
    }
  }, [])

  useEffect(() => {
    setupRealtime()
  }, [])

  return globalSettings
}

async function loadSettings() {
  const data = await fetchAll()
  if (data) {
    globalSettings = { ...data, loading: false }
  } else {
    globalSettings = { school: null, website: null, homepage: null, loading: false, error: true }
  }
  notifyListeners()
}

export async function refreshSettings() {
  globalSettings = { school: null, website: null, homepage: null, loading: true, error: false }
  notifyListeners()
  await loadSettings()
}
