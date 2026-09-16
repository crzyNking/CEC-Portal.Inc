import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAuthModalStore } from '../store/authModalStore'
import { useSettings } from '../hooks/useSettings'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePageTitle } from '../hooks/usePageTitle'
import { CEC_LOGO } from '../lib/constants'
import Header from '../components/Header'
import Footer from '../components/Footer'

const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop'

const academicCards = [
  { title: 'Basic Education', desc: 'A strong foundation for lifelong learning, fostering curiosity and critical thinking.' },
  { title: 'Senior High', desc: 'Specialized tracks preparing students for college and future careers.' },
  { title: 'Higher Education', desc: 'Professional degree programs shaping the industry leaders of tomorrow.' },
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

  return <div ref={ref} className="text-black text-[36px] sm:text-[48px] font-bold leading-none mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{count}{suffix}</div>
}

export function Home() {
  usePageTitle('Home')
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()
  const location = useLocation()
  const { school, homepage, website } = useSettings()
  const openAuth = useAuthModalStore((s) => s.openAuth)

  useEffect(() => {
    if (user && !loading) {
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [user, loading, navigate, location.state])

  const heroBgImage = homepage?.hero_image || DEFAULT_HERO_BG
  const heroStyle = { background: `linear-gradient(rgba(11, 31, 58, 0.5), rgba(11, 31, 58, 0.5)), url(${heroBgImage}) center/cover no-repeat` }

  const academicRef = useScrollReveal()
  const heritageRef = useScrollReveal()
  const statsRef = useScrollReveal()
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
              <div key={card.title} className="group bg-[#F8FAFC] rounded-xl p-6 text-left shadow-[0_4px_20px_rgba(11,31,58,0.06)] backdrop-blur-sm border border-[rgba(11,31,58,0.08)] hover:border-[#0B1F3A]/20 card-glow cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002366] to-[#1d4ed8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={
                      card.title === 'Basic Education'
                        ? 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
                        : card.title === 'Senior High'
                          ? 'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z'
                          : 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.665 6.023 6.023 0 0 1-2.77-.665'
                    } />
                  </svg>
                </div>
                <h3 className="text-[14px] font-bold text-[#1e293b] mb-2">{card.title}</h3>
                <p className="text-[12px] text-[#64748b] leading-[1.5]">{card.desc}</p>
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
    </div>
  )
}
