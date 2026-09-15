import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../hooks/useSettings'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'
import { CEC_LOGO } from '../lib/constants'
import Header from '../components/Header'
import Footer from '../components/Footer'

const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop'

const authModalBackdrop = { background: 'rgba(11, 31, 58, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

type AuthMode = 'login' | 'signup'

const academicCards = [
  {
    title: 'Basic Education',
    desc: 'A strong foundation for lifelong learning, fostering curiosity and critical thinking.',
    icon: (
      <svg className="w-9 h-9 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    link: '/senior-high',
  },
  {
    title: 'Senior High',
    desc: 'Specialized tracks preparing students for college and future careers.',
    icon: (
      <svg className="w-9 h-9 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    link: '/senior-high',
  },
  {
    title: 'Higher Education',
    desc: 'Professional degree programs shaping the industry leaders of tomorrow.',
    icon: (
      <svg className="w-9 h-9 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    link: '/enrollment/college',
  },
]

const features = [
  { title: 'Affordable Tuition', desc: 'Quality education without the heavy financial burden.' },
  { title: 'Diverse Community', desc: 'A welcoming environment for students from all backgrounds.' },
]

const stats = [
  { target: 1915, suffix: '', label: 'Year Founded' },
  { target: 5000, suffix: '+', label: 'Students Every Year' },
  { target: 8, suffix: '', label: 'Courses' },
]

const whyChooseUs = [
  { title: 'Experienced Faculty', desc: 'Dedicated educators with years of industry and academic experience.', icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342' },
  { title: 'Modern Facilities', desc: 'State-of-the-art labs, libraries, and learning spaces.', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { title: 'Holistic Development', desc: 'Programs that nurture mind, body, and character.', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z' },
  { title: 'Strong Alumni Network', desc: 'Over a century of graduates making an impact worldwide.', icon: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z' },
]

const testimonials = [
  { name: 'Maria Santos', role: 'College Graduate, BS Accountancy', text: 'CEC gave me the foundation and confidence to succeed in the CPA board exams. The faculty truly cares about every student.' },
  { name: 'Juan Dela Cruz', role: 'Senior High Student', text: 'The STEM program here is outstanding. I got accepted into my dream university because of the quality education CEC provided.' },
  { name: 'Ana Reyes', role: 'Parent', text: 'As a parent, I trust CEC with my children\'s education. The environment is nurturing and the academics are top-notch.' },
]

const enrollmentLevels = [
  { title: 'Kindergarten', ages: 'Ages 3-5', color: 'from-blue-500 to-blue-700', path: '/enrollment/kindergarten' },
  { title: 'Elementary', ages: 'Grades 1-6', color: 'from-indigo-500 to-indigo-700', path: '/enrollment/elementary' },
  { title: 'Junior High', ages: 'Grades 7-10', color: 'from-violet-500 to-violet-700', path: '/enrollment/junior-high' },
  { title: 'Senior High', ages: 'Grades 11-12', color: 'from-purple-500 to-purple-700', path: '/enrollment/senior-high' },
  { title: 'College', ages: "Bachelor's Degree", color: 'from-[#8496db] to-[#4f61b3]', path: '/enrollment/college' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const duration = 1600
        const start = performance.now()
        const update = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(update)
          else setCount(target)
        }
        requestAnimationFrame(update)
      }
    }, { threshold: 0.2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref} className="text-black text-[36px] sm:text-[48px] font-bold leading-none mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{count.toLocaleString()}{suffix}</div>
}

export function Home() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail)
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const error = useAuthStore((s) => s.error)
  const setError = useAuthStore((s) => s.setError)
  const navigate = useNavigate()
  const location = useLocation()
  const { school, homepage, website } = useSettings()

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: AuthMode }>({ open: false, mode: 'login' })
  const [authTab, setAuthTab] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const openAuth = useCallback((mode: AuthMode) => {
    setAuthTab(mode)
    setAuthModal({ open: true, mode })
    setError(null)
  }, [setError])

  const closeAuth = useCallback(() => {
    setAuthModal({ open: false, mode: 'login' })
    setEmail('')
    setPassword('')
    setFullName('')
    setSubmitting(false)
    setError(null)
  }, [setError])

  useEffect(() => {
    if (user && !loading) {
      closeAuth()
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [user, loading, closeAuth, navigate, location.state])

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (authTab === 'login') {
        await signInWithEmail(email, password)
      } else {
        const result = await signUpWithEmail(email, password, fullName)
        if (result.success && result.message.includes('check your email')) {
          setSubmitting(false)
          return
        }
      }
    } finally {
      setSubmitting(false)
    }
  }, [authTab, email, password, fullName, signInWithEmail, signUpWithEmail])

  const handleGoogleLogin = useCallback(async () => {
    await signInWithGoogle()
  }, [signInWithGoogle])

  const handleForgotPassword = useCallback(async () => {
    if (!email) {
      setError('Please enter your email address first.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    })
    if (error) {
      setError(error.message)
    } else {
      setError(null)
      alert('Password reset link sent! Check your email.')
    }
  }, [email, setError])

  const heroBgImage = homepage?.hero_image || DEFAULT_HERO_BG
  const heroStyle = { background: `linear-gradient(rgba(11, 31, 58, 0.5), rgba(11, 31, 58, 0.5)), url(${heroBgImage}) center/cover no-repeat` }

  const academicRef = useScrollReveal()
  const heritageRef = useScrollReveal()
  const statsRef = useScrollReveal()
  const enrollRef = useScrollReveal()
  const whyRef = useScrollReveal()
  const testimonialRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#333333] overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative py-[60px] px-4 sm:py-[80px] text-center text-white overflow-hidden" style={heroStyle}>
        <div className="animate-float opacity-20 absolute top-10 left-10 w-32 h-32 bg-[#1d4ed8] rounded-full blur-3xl" />
        <div className="animate-float opacity-15 absolute bottom-10 right-10 w-48 h-48 bg-[#eab308] rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
        <p className="text-[#F59E0B] text-[28px] sm:text-[38px] font-semibold tracking-[8px] mb-[30px] animate-gradient-text relative z-10">
          {homepage?.hero_subtitle || '宿務 東方 學院'}
        </p>

        <div className="max-w-[820px] mx-auto rounded-xl p-6 sm:p-[45px_50px] shadow-[0_20px_40px_rgba(0,0,0,0.35)] outline outline-1 outline-offset-[-8px] outline-white/15 bg-gradient-to-br from-[rgba(8,30,92,0.88)] to-[rgba(13,44,128,0.88)] border border-white/20 backdrop-blur-[12px] reveal-scale visible relative z-10">
          <h1 className="text-[26px] sm:text-[32px] font-extrabold leading-[1.25] mb-5">
            {homepage?.hero_title || 'Excellence in Education'}<br />since 1915
          </h1>
          <p className="text-[12px] sm:text-[13.5px] text-[#cbd5e1] max-w-[580px] mx-auto mb-[30px] leading-relaxed">
            {homepage?.hero_description || "Be part of the Easternian Community, where quality education is less expensive. Join Cebu City's premier institution for holistic development."}
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => openAuth('login')} className="px-8 py-2 rounded-md text-[12px] font-semibold bg-[#1E4E8C] text-white hover:bg-[#0B1F3A] shadow-lg shadow-navy-900/20 transition-all duration-300 hover:scale-105 active:scale-95">
              Log In
            </button>
            <button onClick={() => openAuth('signup')} className="px-8 py-2 rounded-md text-[12px] font-semibold bg-transparent text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      {website?.programs_section !== false && (
        <section ref={academicRef.ref} className={`py-[60px] px-4 sm:px-10 bg-[#f8fafc] text-center reveal ${academicRef.isVisible ? 'visible' : ''}`}>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-2">Academic Excellence</h2>
          <p className="text-[12px] sm:text-[13px] text-[#64748b] mb-[45px]">Comprehensive educational programs designed to nurture future leaders.</p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto stagger-children ${academicRef.isVisible ? 'visible' : ''}`}>
            {academicCards.map((card) => (
              <div key={card.title} onClick={() => navigate(card.link)} className="bg-white rounded-lg p-[30px_25px] text-left shadow-[0_4px_20px_rgba(11,31,58,0.06)] backdrop-blur-sm border border-[rgba(11,31,58,0.08)] flex flex-col card-glow cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#dbeafe] flex items-center justify-center mb-5">{card.icon}</div>
                <h3 className="text-[16px] font-bold text-[#1e293b] mb-3">{card.title}</h3>
                <p className="text-[12.5px] text-[#64748b] leading-[1.5] mb-5 flex-1">{card.desc}</p>
                <span className="text-[11.5px] font-bold text-[#1E4E8C] flex items-center gap-1.5">
                  Learn More
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Our Heritage & Mission */}
      <section ref={heritageRef.ref} className="py-[70px] px-4 sm:px-10 bg-[#f1f5f9]">
        <div className="max-w-[1050px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-[60px]">
          <div className={`flex-shrink-0 flex justify-center reveal-left ${heritageRef.isVisible ? 'visible' : ''}`}>
            <div className="logo-container shadow-lg">
              <img src={school?.website_logo || CEC_LOGO} alt="Cebu Eastern College Seal" className="hover:scale-[1.05] transition-transform duration-500" />
            </div>
          </div>
          <div className={`flex-1 text-center md:text-left reveal-right ${heritageRef.isVisible ? 'visible' : ''}`}>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-4">Our Heritage &amp; Mission</h2>
            <p className="text-[12px] sm:text-[13px] text-[#64748b] leading-relaxed mb-[30px]">
              {school?.school_description || 'Founded in 1915, Cebu Eastern College has stood as a pillar of academic excellence in Cebu City. We remain committed to our founding principle: delivering top-tier, quality education that is accessible and affordable to all aspiring minds.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 text-left">
                  <svg className="w-5 h-5 text-[#1d4ed8] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1e293b] mb-1">{f.title}</h4>
                    <p className="text-[11.5px] text-[#64748b] leading-[1.4]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section ref={statsRef.ref} className={`bg-white py-[30px] sm:py-[40px] reveal ${statsRef.isVisible ? 'visible' : ''}`}>
        <div className={`max-w-[900px] mx-auto flex flex-wrap justify-center stagger-children ${statsRef.isVisible ? 'visible' : ''}`}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-[12px] sm:py-[15px] px-[30px] sm:px-[50px] border-r border-black/10 last:border-r-0">
              <CountUp target={s.target} suffix={s.suffix} />
              <div className="text-[#333333] text-[10px] sm:text-[12px] font-semibold tracking-[1px] uppercase text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Enrollment Links */}
      <section ref={enrollRef.ref} className={`py-[60px] px-4 sm:px-10 bg-[#f8fafc] text-center reveal ${enrollRef.isVisible ? 'visible' : ''}`}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-2">Start Your Enrollment</h2>
        <p className="text-[12px] sm:text-[13px] text-[#64748b] mb-[45px]">Choose your level and begin your journey with CEC.</p>
        <div className={`flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto stagger-children ${enrollRef.isVisible ? 'visible' : ''}`}>
          {enrollmentLevels.map((level) => (
            <button key={level.title} onClick={() => navigate(level.path)} className={`bg-gradient-to-r ${level.color} text-white px-6 py-3 rounded-xl font-bold text-[13px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2`}>
              {level.title}
              <span className="text-white/60 text-[11px] font-normal">{level.ages}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Why Choose CEC */}
      <section ref={whyRef.ref} className={`py-[60px] px-4 sm:px-10 bg-white text-center reveal ${whyRef.isVisible ? 'visible' : ''}`}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-2">Why Choose CEC?</h2>
        <p className="text-[12px] sm:text-[13px] text-[#64748b] mb-[45px]">What makes us stand out from the rest.</p>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto stagger-children ${whyRef.isVisible ? 'visible' : ''}`}>
          {whyChooseUs.map((item) => (
            <div key={item.title} className="group bg-[#F8FAFC] rounded-xl p-6 text-left shadow-[0_4px_20px_rgba(11,31,58,0.06)] backdrop-blur-sm border border-[rgba(11,31,58,0.08)] hover:border-[#0B1F3A]/20 card-glow cursor-default">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002366] to-[#1d4ed8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <h3 className="text-[14px] font-bold text-[#1e293b] mb-2">{item.title}</h3>
              <p className="text-[12px] text-[#64748b] leading-[1.5]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialRef.ref} className={`py-[60px] px-4 sm:px-10 bg-[#f1f5f9] text-center reveal ${testimonialRef.isVisible ? 'visible' : ''}`}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-2">What People Say</h2>
        <p className="text-[12px] sm:text-[13px] text-[#64748b] mb-[45px]">Hear from our students, alumni, and parents.</p>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto stagger-children ${testimonialRef.isVisible ? 'visible' : ''}`}>
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-6 text-left shadow-sm hover:shadow-md backdrop-blur-sm border border-[rgba(11,31,58,0.06)] transition-shadow duration-300">
              <svg className="w-8 h-8 text-[#002366]/15 mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" /></svg>
              <p className="text-[12.5px] text-[#475569] leading-[1.6] mb-4">{t.text}</p>
              <div className="border-t border-[#e2e8f0] pt-3">
                <p className="text-[13px] font-bold text-[#1e293b]">{t.name}</p>
                <p className="text-[11px] text-[#64748b]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef.ref} className={`py-[60px] px-4 bg-[#0B1F3A] backdrop-blur-xl text-center text-white reveal-scale ${ctaRef.isVisible ? 'visible' : ''}`}>
        <h2 className="text-[28px] sm:text-[32px] font-extrabold mb-3.5">Join the Easternian<br />Community</h2>
        <p className="text-[12px] sm:text-[13.5px] text-[#cbd5e1] mb-6">Begin your journey towards academic excellence and personal growth today.</p>
        <button onClick={() => openAuth('signup')} className="px-6 py-2.5 rounded-md text-[13px] font-bold bg-white text-[#002366] hover:bg-[#f1f5f9] transition-all duration-300 hover:scale-105 active:scale-95">
          Sign Up Now
        </button>
      </section>

      <Footer />

      {/* Auth Modal */}
      {authModal.open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={authModalBackdrop}
          onClick={(e) => { if (e.target === e.currentTarget) closeAuth() }}
        >
          <div className="bg-[rgba(13,33,84,0.92)] border border-white/20 rounded-2xl w-full max-w-[420px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[20px] relative text-white overflow-hidden" style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards' }}>
            <button onClick={closeAuth} className="absolute top-4 right-5 text-[#94a3b8] hover:text-white text-xl">&times;</button>

            <div className="p-[35px_30px]">
              <div className="text-center mb-6">
                <img src={school?.website_logo || CEC_LOGO} alt="CEC Seal" className="w-[65px] h-[65px] rounded-full mx-auto mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
                <h3 className="text-[20px] font-semibold">{school?.school_name || 'Cebu Eastern College'}</h3>
              </div>

              <div className="flex bg-white/8 border border-white/15 rounded-lg p-[3px] mb-6">
                <button onClick={() => { setAuthTab('login'); setSubmitting(false); setError(null) }} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${authTab === 'login' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8]'}`}>Log In</button>
                <button onClick={() => { setAuthTab('signup'); setSubmitting(false); setError(null) }} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${authTab === 'signup' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8]'}`}>Sign Up</button>
              </div>

              {error && <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-[12px] rounded-lg px-4 py-3 mb-4">{error}</div>}

              <form onSubmit={handleAuth} className="flex flex-col gap-3.5">
                {authTab === 'signup' && (
                  <div className="relative">
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Full Name" required />
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                  </div>
                )}
                <div className="relative">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Email Address" required />
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <div className="relative">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Password" required minLength={6} />
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
                {authTab === 'login' && <div className="text-right"><button type="button" onClick={handleForgotPassword} className="text-[11px] text-[#cbd5e1] hover:underline">Forgot Password?</button></div>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-white text-[#0f172a] rounded-lg text-[13.5px] font-bold hover:bg-[#f1f5f9] transition-all disabled:opacity-50 mt-2.5">
                  {submitting ? 'Please wait...' : authTab === 'login' ? 'Log In' : 'Create Account'}
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/15" /></div>
                <div className="relative flex justify-center text-[11px]"><span className="px-3 text-[#94a3b8]">or</span></div>
              </div>

              <button onClick={handleGoogleLogin} className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2.5">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <p className="text-center text-[11.5px] text-[#cbd5e1] mt-4">
                {authTab === 'login' ? "Don't have an Account? " : 'Already have an Account? '}
                <button onClick={() => { setAuthTab(authTab === 'login' ? 'signup' : 'login'); setSubmitting(false); setError(null) }} className="text-white font-semibold underline">
                  {authTab === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
