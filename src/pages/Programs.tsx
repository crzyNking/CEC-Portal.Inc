import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAuthModalStore } from '../store/authModalStore'
import { usePageTitle } from '../hooks/usePageTitle'
import { CEC_LOGO } from '../lib/constants'
import Header from '../components/Header'
import Footer from '../components/Footer'

const k12Cards = [
  { title: 'Kindergarten', desc: 'The Kindergarten Department of CEC provides a supportive environment that fosters early growth, creativity, and basic skills for young learners.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80', link: '/programs/kindergarten' },
  { title: 'Elementary', desc: 'The Elementary Department nurtures young minds with strong values, foundational academic skills, and lifelong learning habits.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80', link: '/programs/elementary' },
  { title: 'Junior High School', desc: 'Offering dynamic programs designed to strengthen critical thinking, character, and personal development in preparation for higher education.', img: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=400&q=80', link: '/programs/junior-high' },
  { title: 'Senior High School', desc: 'Provides specialized academic tracks and practical training to effectively prepare students for college and future careers.', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80', link: '/programs/senior-high' },
]

const collegePrograms = [
  { name: 'Bachelor of Science in Information Technology', icon: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 7.41A2.25 2.25 0 0 1 2.25 5.495V5.25', link: '/programs/bsit' },
  { name: 'Bachelor of Science in Hospitality Management', icon: 'M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015A3.001 3.001 0 0 0 21 9.349', link: '/programs/bshm' },
  { name: 'Bachelor of Science in Criminology', icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z', link: '/programs/criminology' },
  { name: 'Bachelor of Science in Tourism Management', icon: 'M6.115 5.19l.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64', link: '/programs/bstm' },
  { name: 'Bachelor of Secondary Education', icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5', link: '/programs/bsed' },
  { name: 'Bachelor of Elementary Education', icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25', link: '/programs/beed' },
]

const academicCards = [
  { icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25', title: 'Basic Education', desc: 'A strong foundation for lifelong learning, fostering curiosity and critical thinking.' },
  { icon: 'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z', title: 'Senior High', desc: 'Specialized tracks preparing students for college and future careers.' },
  { icon: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.665 6.023 6.023 0 0 1-2.77-.665', title: 'Higher Education', desc: 'Professional degree programs shaping the industry leaders of tomorrow.' },
]

export default function Programs() {
  usePageTitle('Academic Programs')
  const { user, loading } = useAuthStore()
  const navigate = useNavigate()
  const openAuth = useAuthModalStore((s) => s.openAuth)

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#333333] overflow-x-hidden">
      <Header />

      {/* Hero with Programs Overlay Card */}
      <section
        className="relative py-8 px-4 sm:py-10 flex justify-center"
        style={{ background: "linear-gradient(rgba(11, 31, 58, 0.65), rgba(11, 31, 58, 0.65)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat" }}
      >
        <div className="w-full max-w-[1100px] rounded-2xl p-5 sm:p-8 md:p-[35px_40px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-[40px] border border-white/10 bg-[rgba(11,31,58,0.92)] backdrop-blur-[8px]">
          <div>
            <div className="flex items-center gap-2.5 text-white text-base sm:text-[18px] font-bold pb-3 border-b-2 border-[#1E4E8C] mb-4 sm:mb-5">
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <span>K-12 Education</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {k12Cards.map((item) => (
                <div key={item.title} className="bg-white rounded-lg overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex flex-col">
                  <div className="h-24 sm:h-[100px] bg-cover bg-center relative" style={{ backgroundImage: `url('${item.img}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end px-3 py-2">
                      <h4 className="text-white text-xs sm:text-[14px] font-bold drop-shadow-md">{item.title}</h4>
                    </div>
                  </div>
                  <div className="p-2.5 flex flex-col flex-grow justify-between">
                    <p className="text-[10px] text-[#475569] leading-[1.3] mb-2.5">{item.desc}</p>
                    <Link to={item.link} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1d4ed8] hover:underline">
                      Learn More
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5 text-white text-base sm:text-[18px] font-bold pb-3 border-b-2 border-[#1E4E8C] mb-4 sm:mb-5">
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
              <span>College Programs</span>
            </div>
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {collegePrograms.map((prog) => (
                <Link to={prog.link} key={prog.name} className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer bg-gradient-to-r from-[#dbe2ef] to-[#e2e8f0]">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#1E4E8C] text-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={prog.icon} />
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-[#1e293b] text-left truncate">{prog.name}</span>
                  </div>
                  <svg className="w-2.5 h-2.5 text-[#94a3b8] shrink-0 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="py-10 sm:py-[60px] px-4 sm:px-10 bg-white text-center">
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0B1F3A] mb-2">Academic Excellence</h2>
        <p className="text-[12px] sm:text-[13px] text-[#64748b] mb-[45px]">Comprehensive educational programs designed to nurture future leaders.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {academicCards.map((card) => (
            <div key={card.title} className="group bg-[#F8FAFC] rounded-xl p-6 text-left shadow-[0_4px_20px_rgba(11,31,58,0.06)] backdrop-blur-sm border border-[rgba(11,31,58,0.08)] hover:border-[#0B1F3A]/20 card-glow cursor-default">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002366] to-[#1d4ed8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <h3 className="text-[14px] font-bold text-[#1e293b] mb-2">{card.title}</h3>
              <p className="text-[12px] text-[#64748b] leading-[1.5]">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-10 sm:py-[70px] px-4 sm:px-10 bg-[#f1f5f9]">
        <div className="max-w-[1050px] mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-[60px]">
          <div className="shrink-0 flex justify-center items-center w-full lg:w-[260px]">
            <img src={CEC_LOGO} alt="CEC Seal" className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-contain mix-blend-multiply transition-transform hover:scale-[1.03]" loading="lazy" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl sm:text-[26px] font-extrabold text-[#0B1F3A] mb-4">Our Heritage & Mission</h2>
            <p className="text-xs sm:text-[13px] text-[#64748b] leading-relaxed mb-6 sm:mb-[30px]">
              Founded in 1915, Cebu Eastern College has stood as a pillar of academic excellence in Cebu City. We remain committed to our founding principle: delivering top-tier, quality education that is accessible and affordable to all aspiring minds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: 'Affordable Tuition', desc: 'Quality education without the heavy financial burden.' },
                { title: 'Diverse Community', desc: 'A welcoming environment for students from all backgrounds.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#1d4ed8]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#1e293b] mb-1">{f.title}</h4>
                    <p className="text-[11.5px] text-[#64748b] leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-[50px] bg-[#0B1F3A] text-center text-white px-4">
        <h2 className="text-2xl sm:text-[28px] font-extrabold mb-2.5 tracking-tight">Join the Easternian<br />Community</h2>
        <p className="text-xs sm:text-[13px] text-[#cbd5e1] mb-6">Begin your journey towards academic excellence and personal growth today.</p>
        <button
          onClick={() => openAuth('signup')}
          className="bg-white text-[#0B1F3A] font-bold text-[13px] px-6 py-2.5 rounded-md hover:bg-[#f1f5f9] transition-colors border-none cursor-pointer"
        >
          Sign Up Now
        </button>
      </section>

      <Footer />
    </div>
  )
}
