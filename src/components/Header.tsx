import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthModalStore } from '../store/authModalStore'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../hooks/useSettings'
import { CEC_LOGO } from '../lib/constants'
import AnnouncementBar from './AnnouncementBar'

const k12Data = [
  { title: 'Kindergarten', desc: 'A supportive environment fostering early growth, creativity, and basic skills for young learners.', path: '/programs/kindergarten', img: '/images/selfhost/nn31S9f.jpg' },
  { title: 'Elementary', desc: 'Nurturing young minds with strong values, foundational academic skills, and lifelong learning habits.', path: '/programs/elementary', img: '/images/selfhost/nn3sBol.jpg' },
  { title: 'Junior High School', desc: 'Dynamic programs strengthening critical thinking, character, and personal development.', path: '/programs/junior-high', img: '/images/selfhost/nnDzDyg.jpg' },
  { title: 'Senior High School', desc: 'Specialized academic tracks and practical training for college and future careers.', path: '/programs/senior-high', img: '/images/selfhost/nnF3vgs.jpg' },
]

const collegeData = [
  { name: 'BS in Information Technology', path: '/programs/bsit' },
  { name: 'BS in Hospitality Management', path: '/programs/bshm' },
  { name: 'BS in Criminology', path: '/programs/criminology' },
  { name: 'BS in Tourism Management', path: '/programs/bstm' },
  { name: 'BS in Secondary Education', path: '/programs/bsed' },
  { name: 'BS in Elementary Education', path: '/programs/beed' },
]

const enrollK12 = [
  { title: 'KINDERGARTEN', path: '/enrollment/kindergarten', img: '/images/enrollment/kindergarten.png' },
  { title: 'ELEMENTARY', path: '/enrollment/elementary', img: '/images/enrollment/elementary.png' },
  { title: 'JUNIOR HIGH', path: '/enrollment/junior-high', img: '/images/selfhost/nnpDTy7.png' },
  { title: 'SENIOR HIGH', path: '/enrollment/senior-high', img: '/images/selfhost/nnpmqg4.png' },
]

const servicesData = [
  { name: 'Registrar', img: '/images/selfhost/nnE0v1J.jpg' },
  { name: 'EDP', img: '/images/selfhost/nnE08Pu.jpg' },
  { name: 'Accounting', img: '/images/selfhost/nnE0l1X.jpg' },
  { name: 'Clinic', img: '/images/selfhost/nnE0bDP.jpg' },
  { name: 'Library', img: '/images/selfhost/nnE0JQB.jpg' },
  { name: 'Guidance', img: '/images/selfhost/nnE0C7g.jpg' },
]

const campusesData = [
  { title: 'Main Campus', desc: 'The main campus of Cebu Eastern College on Leon Kilat Street, Cebu City, serves as the central hub for its Senior High School and College programs.', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', path: '/campus/main' },
  { title: 'SHS Campus', desc: "Located at D. Dionisio Jakosalem Street in Barangay Santo Niño, the Cebu Eastern College serves as a historic hub for the institution's Senior High School.", img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', path: '/campus/main' },
]

const moreInfoData = [
  { name: 'About Us', desc: 'Our history, mission, and vision', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', path: '/about' },
  { name: 'Privacy Policy', desc: 'How we protect your data', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', path: '/privacy' },
  { name: 'News & Events', desc: 'Latest updates and announcements', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z', path: '/news' },
]

type Dropdown = 'programs' | 'enrollment' | 'services' | 'about' | null
type MobileAccordion = 'programs' | 'enrollment' | 'services' | 'about' | null
type MobilePage = 'main' | 'enroll-picker'

function DropdownHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <>
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <h2 className="text-[#f7e0b5] text-[17px] font-semibold tracking-wide">{title}</h2>
      </div>
      <div className="h-[2px] bg-[#7b95c6] w-[50%] mb-5" />
    </>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobilePage, setMobilePage] = useState<MobilePage>('main')
  const [activeDropdown, setActiveDropdown] = useState<Dropdown>(null)
  const [mobileAccordion, setMobileAccordion] = useState<MobileAccordion>(null)
  const navRef = useRef<HTMLElement>(null)
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path: string) => location.pathname === path
  const isAboutActive = location.pathname === '/about' || location.pathname === '/news' || location.pathname === '/privacy' || location.pathname.startsWith('/campus/')
  const openAuth = useAuthModalStore((s) => s.openAuth)
  const { school } = useSettings()
  const { profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'

  const closeAll = useCallback(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
    setMobileAccordion(null)
    setMobilePage('main')
  }, [])

  useEffect(() => {
    closeAll()
  }, [location.pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const openDropdown = useCallback((d: Dropdown) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setActiveDropdown(d)
  }, [])

  const closeDropdownDelayed = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }, [])

  const toggleMobileAccordion = (section: MobileAccordion) => {
    setMobileAccordion((prev) => (prev === section ? null : section))
  }

  const navigateAndClose = useCallback((path: string) => {
    closeAll()
    navigate(path)
  }, [closeAll, navigate])

  const navItemClass = (active: boolean) =>
    `text-[13.5px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
      active ? 'text-white' : 'text-[#cbd5e1] hover:text-white'
    }`

  return (
    <>
      {!mobileOpen && <AnnouncementBar />}
      <header ref={navRef} className={`${mobileOpen ? 'fixed top-0 left-0 right-0' : 'sticky top-0'} z-50 bg-[#0b1f40] text-white border-b border-white/30`}>
      <div className="flex items-center justify-between px-4 py-4 md:px-10 md:py-4">
        {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 z-10">
            <img src={school?.website_logo || CEC_LOGO} alt="CEC Logo" className="w-10 h-10 md:w-[46px] md:h-[46px] rounded-full object-cover bg-white" />
            <div>
              <div className="text-[15px] md:text-[17px] font-bold tracking-wide">{school?.school_name || 'Cebu Eastern College'}</div>
              <div className="text-[10px] md:text-[11px] text-[#94a3b8]">{school?.address || 'Leon Kilat St., Cebu City'}</div>
            </div>
          </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-7 xl:gap-9 items-center absolute left-1/2 -translate-x-1/2">
          {/* Home */}
          <Link to="/" className={navItemClass(isActive('/'))}>
            Home
          </Link>

          {/* Programs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown('programs')}
            onMouseLeave={closeDropdownDelayed}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'programs' ? null : 'programs')}
              className={navItemClass(isActive('/programs/'))}
              aria-expanded={activeDropdown === 'programs'}
              aria-haspopup="true"
            >
              Programs
              <svg className={`w-2.5 h-2.5 opacity-50 transition-transform duration-200 ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'programs' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60]"
                onMouseEnter={() => openDropdown('programs')}
                onMouseLeave={closeDropdownDelayed}
              >
                <div className="relative w-[min(980px,calc(100vw-2rem))] bg-[#061830] rounded-2xl shadow-2xl border border-white/10 p-5 xl:p-7">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#061830] border-l border-t border-white/10 rotate-45" />
                  <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
                    {/* K-12 */}
                    <div>
                      <DropdownHeader
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
                        title="K-12 Education"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        {k12Data.map((prog) => (
                          <button
                            key={prog.title}
                            onClick={() => navigateAndClose(prog.path)}
                            className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200 text-left flex flex-col"
                          >
                            <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C]">
                              <img
                                src={prog.img}
                                alt={prog.title}
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-4 bg-gradient-to-t from-black/75 to-transparent">
                                <h3 className="text-white text-[14px] font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{prog.title}</h3>
                              </div>
                            </div>
                            <div className="p-2.5 flex flex-col flex-grow justify-between">
                              <p className="text-[#556070] text-[10px] leading-[1.4] mb-2">{prog.desc}</p>
                              <span className="text-[#0b2545] text-[11px] font-bold inline-flex items-center gap-1 group-hover:text-blue-700 transition-colors">
                                Learn More
                                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* College */}
                    <div>
                      <DropdownHeader
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" /></svg>}
                        title="College Programs"
                      />
                      <div className="relative pl-4 mt-4">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a365d]" />
                        <div className="flex flex-col gap-2">
                          {collegeData.map((prog) => (
                            <button
                              key={prog.name}
                              onClick={() => navigateAndClose(prog.path)}
                              className="group flex items-center gap-3 bg-[#dce4ed] rounded-lg py-1.5 pr-3 pl-3 hover:bg-[#d2dce8] transition-all duration-200 cursor-pointer"
                            >
                              <span className="text-[#0b2545] font-semibold text-[12px] leading-[1.3] flex-grow text-left">{prog.name}</span>
                              <svg className="w-3.5 h-3.5 text-[#a0aebc] group-hover:text-[#0b2545] group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown('enrollment')}
            onMouseLeave={closeDropdownDelayed}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'enrollment' ? null : 'enrollment')}
              className={navItemClass(false)}
              aria-expanded={activeDropdown === 'enrollment'}
              aria-haspopup="true"
            >
              Enrollment
              <svg className={`w-2.5 h-2.5 opacity-50 transition-transform duration-200 ${activeDropdown === 'enrollment' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'enrollment' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60]"
                onMouseEnter={() => openDropdown('enrollment')}
                onMouseLeave={closeDropdownDelayed}
              >
                <div className="relative w-[min(860px,calc(100vw-2rem))] bg-[#061830]/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-5 xl:p-7">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#061830] border-l border-t border-white/10 rotate-45" />
                  <div className="grid grid-cols-[1.15fr_0.85fr] gap-6">
                    {/* K-12 */}
                    <div>
                      <div className="flex items-center gap-2.5 pb-2 mb-4 border-b-[1.5px] border-blue-500">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                        </svg>
                        <span className="text-white text-[15px] font-bold">K-12 Education</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {enrollK12.map((card) => (
                          <button
                            key={card.title}
                            onClick={() => navigateAndClose(card.path)}
                            className="group relative bg-gradient-to-b from-[#0B1F3A] to-[#0F2356] rounded-xl h-[150px] border border-white/20 overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:border-white/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-200 flex flex-col p-2.5 cursor-pointer"
                          >
                            <span className="text-[#F1EACA] text-[11px] font-extrabold tracking-wide uppercase text-center mb-1.5 relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                              {card.title}
                            </span>
                            <div className="relative flex-1 w-full overflow-hidden rounded-lg">
                              <img src={card.img} alt={card.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <svg className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-white/0 group-hover:text-white/70 transition-all duration-200 translate-x-1 group-hover:translate-x-0 z-10" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* College */}
                    <div>
                      <div className="flex items-center gap-2.5 pb-2 mb-4 border-b-[1.5px] border-blue-500">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
                        </svg>
                        <span className="text-white text-[15px] font-bold">College Programs</span>
                      </div>
                      <button
                        onClick={() => navigateAndClose('/enrollment/college')}
                        className="group w-full bg-gradient-to-b from-[#0B1F3A] to-[#0F2356] rounded-xl h-full min-h-[260px] border border-white/20 overflow-hidden relative flex flex-col justify-between p-4 cursor-pointer hover:-translate-y-0.5 hover:border-white/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-200"
                      >
                        <img src="/images/selfhost/nnyXJlp.png" alt="College" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover" />
                        <span className="text-[#fef08a] text-[20px] font-black tracking-wider uppercase z-10 relative" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                          COLLEGE
                        </span>
                        <svg className="absolute bottom-4 right-4 w-4 h-4 text-white/0 group-hover:text-white/70 transition-all duration-200 translate-x-1 group-hover:translate-x-0 z-10" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown('services')}
            onMouseLeave={closeDropdownDelayed}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              className={navItemClass(false)}
              aria-expanded={activeDropdown === 'services'}
              aria-haspopup="true"
            >
              Services
              <svg className={`w-2.5 h-2.5 opacity-50 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'services' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60]"
                onMouseEnter={() => openDropdown('services')}
                onMouseLeave={closeDropdownDelayed}
              >
                <div className="relative w-[min(560px,calc(100vw-2rem))] bg-[#061830] rounded-2xl shadow-2xl border border-white/10 p-5 xl:p-7">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#061830] border-l border-t border-white/10 rotate-45" />
                  <DropdownHeader
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 7.5L12 13L23 7.5L12 2Z" /><path d="M4 9.5V15.5L12 19.5L20 15.5V9.5L12 13.5L4 9.5Z" /></svg>}
                    title="Services"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {servicesData.map((service) => (
                      <div
                        key={service.name}
                        className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="relative h-[80px] w-full overflow-hidden bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C]">
                          <img
                            src={service.img}
                            alt={service.name}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="py-2.5 px-2">
                          <span className="text-[#061830] text-[12px] font-bold tracking-wider text-center block">{service.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown('about')}
            onMouseLeave={closeDropdownDelayed}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
              className={navItemClass(isAboutActive)}
              aria-expanded={activeDropdown === 'about'}
              aria-haspopup="true"
            >
              About
              <svg className={`w-2.5 h-2.5 opacity-50 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'about' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60]"
                onMouseEnter={() => openDropdown('about')}
                onMouseLeave={closeDropdownDelayed}
              >
                <div className="relative w-[min(820px,calc(100vw-2rem))] bg-[#061830] rounded-2xl shadow-2xl border border-white/10 p-5 xl:p-7">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#061830] border-l border-t border-white/10 rotate-45" />
                  <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
                    {/* Our Campuses */}
                    <div>
                      <DropdownHeader
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" /></svg>}
                        title="Our Campuses"
                      />
                      <div className="flex gap-4">
                        {campusesData.map((campus) => (
                          <button
                            key={campus.title}
                            onClick={() => navigateAndClose(campus.path)}
                            className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200 text-left flex flex-col flex-1"
                          >
                            <div className="relative h-[130px] w-full overflow-hidden">
                              <img src={campus.img} alt={campus.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-4 bg-gradient-to-t from-black/75 to-transparent">
                                <h3 className="text-white text-[15px] font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{campus.title}</h3>
                              </div>
                            </div>
                            <div className="p-3 flex flex-col flex-grow justify-between">
                              <p className="text-[#556070] text-[11px] leading-[1.5] mb-2">{campus.desc}</p>
                              <span className="text-[#0b2545] text-[12px] font-bold inline-flex items-center gap-1 group-hover:text-blue-700 transition-colors">
                                Learn More
                                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* More Information */}
                    <div>
                      <DropdownHeader
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                        title="More Information"
                      />
                      <div className="flex flex-col gap-3">
                        {moreInfoData.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => navigateAndClose(item.path)}
                            className="group flex items-center gap-4 bg-[#dce4ed] rounded-xl py-3 pr-3 pl-3 hover:bg-[#d2dce8] transition-all duration-200 cursor-pointer"
                          >
                            <div className="w-[40px] h-[40px] bg-[#c4d2e2] rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-[18px] h-[18px] text-[#0b2545]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d={item.icon} />
                              </svg>
                            </div>
                            <div className="flex-grow text-left">
                              <span className="text-[#0b2545] font-semibold text-[13px] leading-[1.3] block">{item.name}</span>
                              <span className="text-[#6b7280] text-[10px] leading-[1.3]">{item.desc}</span>
                            </div>
                            <svg className="w-3.5 h-3.5 text-[#a0aebc] group-hover:text-[#0b2545] group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Admin Link */}
        {isAdmin && (
          <Link
            to="/admin"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7b32b]/20 text-[#f7b32b] text-[12px] font-semibold hover:bg-[#f7b32b]/30 transition-colors shrink-0 z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/10 transition-all z-[60] relative"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Full Screen */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-[60] bg-[#081a38] overflow-y-auto flex flex-col">
          <div className="flex-1 px-4 py-4 space-y-1">
            {/* Main Page */}
            {mobilePage === 'main' && (
              <>
                <Link
                  to="/"
                  onClick={closeAll}
                  className={`block text-[14px] font-medium py-2.5 px-3.5 rounded-lg transition-colors ${
                    isActive('/') ? 'text-white bg-white/10' : 'text-[#cbd5e1] hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </Link>

                {/* Programs Accordion */}
                <div>
                  <button
                    onClick={() => toggleMobileAccordion('programs')}
                    className="w-full text-left text-[14px] font-medium py-2.5 px-3.5 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                    aria-expanded={mobileAccordion === 'programs'}
                  >
                    Programs
                    <svg className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200 ${mobileAccordion === 'programs' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {mobileAccordion === 'programs' && (
                    <div className="ml-3 mt-1 mb-2 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">K-12 Education</div>
                        <div className="grid grid-cols-2 gap-2">
                          {k12Data.map((prog) => (
                            <button
                              key={prog.title}
                              onClick={() => navigateAndClose(prog.path)}
                              className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-left flex flex-col"
                            >
                              <div className="relative h-[80px] w-full overflow-hidden">
                                <img src={prog.img} alt={prog.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 px-2 pb-1 pt-2 bg-gradient-to-t from-black/75 to-transparent">
                                  <h3 className="text-white text-[11px] font-semibold">{prog.title}</h3>
                                </div>
                              </div>
                              <div className="p-2">
                                <span className="text-[#0b2545] text-[9px] font-bold inline-flex items-center gap-0.5">
                                  Learn More
                                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">College Programs</div>
                        <div className="space-y-1.5">
                          {collegeData.map((prog) => (
                            <button
                              key={prog.name}
                              onClick={() => navigateAndClose(prog.path)}
                              className="group flex items-center gap-2.5 bg-[#dce4ed] rounded-lg py-1.5 pr-2.5 pl-2.5 hover:bg-[#d2dce8] transition-all duration-200 cursor-pointer w-full"
                            >
                              <span className="text-[#0b2545] font-semibold text-[11px] leading-[1.2] flex-grow text-left">{prog.name}</span>
                              <svg className="w-3 h-3 text-[#a0aebc] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enrollment Accordion */}
                <div>
                  <button
                    onClick={() => toggleMobileAccordion('enrollment')}
                    className="w-full text-left text-[14px] font-medium py-2.5 px-3.5 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                    aria-expanded={mobileAccordion === 'enrollment'}
                  >
                    Enrollment
                    <svg className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200 ${mobileAccordion === 'enrollment' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {mobileAccordion === 'enrollment' && (
                    <div className="ml-3 mt-1 mb-2 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">K-12 Education</div>
                        <div className="grid grid-cols-2 gap-2">
                          {enrollK12.map((card) => (
                            <button
                              key={card.title}
                              onClick={() => navigateAndClose(card.path)}
                              className="group relative bg-gradient-to-b from-[#0B1F3A] to-[#0F2356] rounded-xl border border-white/20 overflow-hidden flex flex-col p-2.5 cursor-pointer min-h-[110px]"
                            >
                              <span className="text-[#F1EACA] text-[10px] font-extrabold tracking-wide uppercase text-center mb-1.5 relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                {card.title}
                              </span>
                              <div className="relative flex-1 w-full overflow-hidden rounded-md min-h-[70px]">
                                <img src={card.img} alt={card.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">College Programs</div>
                        <button
                          onClick={() => navigateAndClose('/enrollment/college')}
                          className="group w-full bg-gradient-to-b from-[#0B1F3A] to-[#0F2356] rounded-xl border border-white/20 overflow-hidden relative flex flex-col justify-between p-3 cursor-pointer min-h-[80px]"
                        >
                          <img src="/images/selfhost/nnyXJlp.png" alt="College" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover" />
                          <span className="text-[#fef08a] text-[16px] font-black tracking-wider uppercase z-10 relative" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            COLLEGE
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services Accordion */}
                <div>
                  <button
                    onClick={() => toggleMobileAccordion('services')}
                    className="w-full text-left text-[14px] font-medium py-2.5 px-3.5 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                    aria-expanded={mobileAccordion === 'services'}
                  >
                    Services
                    <svg className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200 ${mobileAccordion === 'services' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {mobileAccordion === 'services' && (
                    <div className="ml-3 mt-1 mb-2 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2">
                        {servicesData.map((service) => (
                          <div
                            key={service.name}
                            className="group bg-white rounded-xl overflow-hidden cursor-pointer"
                          >
                            <div className="relative h-[70px] w-full overflow-hidden bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C]">
                              <img
                                src={service.img}
                                alt={service.name}
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="py-2 px-2">
                              <span className="text-[#061830] text-[11px] font-bold tracking-wider text-center block">{service.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* About Accordion */}
                <div>
                  <button
                    onClick={() => toggleMobileAccordion('about')}
                    className={`w-full text-left text-[14px] font-medium py-2.5 px-3.5 rounded-lg transition-colors flex items-center justify-between ${isAboutActive ? 'text-white bg-white/10' : 'text-[#cbd5e1] hover:text-white hover:bg-white/10'}`}
                    aria-expanded={mobileAccordion === 'about'}
                  >
                    About
                    <svg className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200 ${mobileAccordion === 'about' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {mobileAccordion === 'about' && (
                    <div className="ml-3 mt-1 mb-2 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">Our Campuses</div>
                        <div className="flex gap-2">
                          {campusesData.map((campus) => (
                            <button
                              key={campus.title}
                              onClick={() => navigateAndClose(campus.path)}
                              className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-left flex flex-col flex-1"
                            >
                              <div className="relative h-[70px] w-full overflow-hidden">
                                <img src={campus.img} alt={campus.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 px-2 pb-1 pt-2 bg-gradient-to-t from-black/75 to-transparent">
                                  <h3 className="text-white text-[10px] font-semibold">{campus.title}</h3>
                                </div>
                              </div>
                              <div className="p-2">
                                <span className="text-[#0b2545] text-[9px] font-bold inline-flex items-center gap-0.5">
                                  Learn More
                                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#94a3b8] font-semibold mb-1.5 uppercase tracking-wider px-1">More Information</div>
                        <div className="space-y-1.5">
                          {moreInfoData.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => navigateAndClose(item.path)}
                              className="group flex items-center gap-3 bg-[#dce4ed] rounded-lg py-2 pr-2.5 pl-2.5 hover:bg-[#d2dce8] transition-all duration-200 cursor-pointer w-full"
                            >
                              <div className="w-[30px] h-[30px] bg-[#c4d2e2] rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-[#0b2545]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                  <path d={item.icon} />
                                </svg>
                              </div>
                              <span className="text-[#0b2545] font-semibold text-[11px] leading-[1.2] flex-grow text-left">{item.name}</span>
                              <svg className="w-3 h-3 text-[#a0aebc] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Enroll Picker Page */}
            {mobilePage === 'enroll-picker' && (
              <>
                <button onClick={() => setMobilePage('main')} className="flex items-center gap-2 text-[#94a3b8] hover:text-white text-[13px] mb-4 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  Back
                </button>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                    </svg>
                    <span className="text-white text-[14px] font-semibold">Choose Your Level</span>
                  </div>
                  <div className="h-[2px] bg-blue-500 w-[40%] mb-3" />
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Kindergarten', desc: 'Ages 3-5', path: '/programs/kindergarten', color: 'from-blue-500 to-blue-700', img: '/images/selfhost/nn31S9f.jpg' },
                    { label: 'Elementary', desc: 'Grades 1-6', path: '/programs/elementary', color: 'from-indigo-500 to-indigo-700', img: 'https://cdn.vectorstock.com/i/500p/82/33/faceless-woman-placeholder-vector-24138233.jpg' },
                    { label: 'Junior High School', desc: 'Grades 7-10', path: '/programs/junior-high', color: 'from-violet-500 to-violet-700', img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Senior High School', desc: 'Grades 11-12', path: '/programs/senior-high', color: 'from-purple-500 to-purple-700', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80' },
                    { label: 'College', desc: "Bachelor's Degree Programs", path: '/enrollment/college', color: 'from-[#8496db] to-[#4f61b3]', img: 'https://cdn.vectorstock.com/i/500p/82/33/faceless-woman-placeholder-vector-24138233.jpg' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigateAndClose(item.path)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r ${item.color} text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 relative overflow-hidden`}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-35 transition-opacity duration-200"
                      />
                      <div className="text-left z-10 relative">
                        <div className="text-[13px] font-bold">{item.label}</div>
                        <div className="text-[11px] text-white/60">{item.desc}</div>
                      </div>
                      <svg className="w-4 h-4 opacity-60 z-10 relative" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom Buttons */}
          {mobilePage === 'main' && (
            <div className="shrink-0 px-4 py-4 border-t border-white/10 bg-[#081a38]">
              <div className="space-y-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeAll}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[#f7b32b]/20 text-[#f7b32b] border border-[#f7b32b]/30 hover:bg-[#f7b32b]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { closeAll(); openAuth('login') }}
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setMobilePage('enroll-picker')}
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-lg shadow-blue-500/25"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
    </>
  )
}



