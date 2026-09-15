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

function notifyListeners() {
  listeners.forEach((l) => l())
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

  return globalSettings
}

async function loadSettings() {
  try {
    const [schoolRes, websiteRes, homepageRes] = await Promise.all([
      supabase.from('school_settings').select('*').limit(1).maybeSingle(),
      supabase.from('website_settings').select('*').limit(1).maybeSingle(),
      supabase.from('homepage_content').select('*').limit(1).maybeSingle(),
    ])

    if (schoolRes.error || websiteRes.error || homepageRes.error) {
      console.error('Settings query errors:', {
        school: schoolRes.error,
        website: websiteRes.error,
        homepage: homepageRes.error,
      })
      globalSettings = { school: null, website: null, homepage: null, loading: false, error: true }
    } else {
      globalSettings = {
        school: schoolRes.data,
        website: websiteRes.data,
        homepage: homepageRes.data,
        loading: false,
        error: false,
      }
    }
  } catch {
    globalSettings = { school: null, website: null, homepage: null, loading: false, error: true }
  }
  notifyListeners()
}

export async function refreshSettings() {
  globalSettings = { school: null, website: null, homepage: null, loading: true, error: false }
  notifyListeners()
  await loadSettings()
}
