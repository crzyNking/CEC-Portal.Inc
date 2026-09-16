import { usePageTitle } from '../hooks/usePageTitle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function JuniorHigh() {
  usePageTitle('Junior High School')
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] overflow-x-hidden">
      <Header />

      {/* Sub-bar / Breadcrumbs */}
      <div className="bg-white border-b border-[#E2E8F0] py-2.5 px-6">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center text-[12px] text-[#475569]">
          <div>
            <a href="/" className="hover:text-[#0B1F3A]">Home</a> &gt;{' '}
            <a href="/programs" className="hover:text-[#0B1F3A]">Academic Programs</a> &gt;{' '}
            <span className="text-[#0F172A] font-semibold">Junior High School</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1.5 text-[#166534] font-medium">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
              AY 2024–2025 Admissions Open
            </span>
            <span className="bg-[#F1F5F9] px-2 py-0.5 rounded font-semibold text-[#475569]">Grades 7 to 10</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Hero Section */}
        <section className="bg-[#071F43] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] mb-8">
          <div className="p-10 md:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Junior High School
              </span>
              <h1 className="text-[28px] md:text-[32px] font-bold leading-[1.25] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
                Building Bright Minds for a Better Future
              </h1>
              <p className="text-[#94A3B8] text-[14px] leading-[1.6] mb-10">
                Helping students in Grades 7 to 10 learn, grow, and discover their strengths through quality education, hands-on activities, and meaningful experiences.
              </p>
            </div>
            <div className="flex gap-5 text-[12px] text-[#CBD5E1]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                DepEd ESC &amp; Voucher Participating
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                Learn 3 Languages
              </span>
            </div>
          </div>
          <div className="relative bg-[#1E293B] min-h-[300px] md:min-h-[350px]">
            <img src="/images/selfhost/nnFwzdB.png" alt="Hands-on Learning" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-4 right-4 bg-[#0F172A]/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              Grade 7–10 Hands-on Learning
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="mb-12">
          <div className="mb-8">
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#475569] flex items-center gap-2 mb-1.5">
              <span className="w-4 h-0.5 bg-[#475569]" />
              Our Curriculum
            </div>
            <h2 className="text-[26px] md:text-[28px] font-bold text-[#0F172A] mb-1.5" style={{ fontFamily: "'Merriweather', serif" }}>
              A Strong Curriculum for Every Learner
            </h2>
            <p className="text-[14px] text-[#475569]">Students build important skills while exploring Science, Math, Technology, Languages, Arts, and more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STEM Card */}
            <div className="bg-[#071F43] rounded-2xl overflow-hidden text-white grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="p-8 flex flex-col">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-5 text-lg">🔬</div>
                <div className="text-[11px] uppercase tracking-wide text-[#F59E0B] font-bold mb-1">STEM Learning</div>
                <h3 className="text-[18px] font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>Science, Math & Robotics</h3>
                <p className="text-[12px] text-[#94A3B8] leading-[1.5] mb-5">
                  Build strong skills in Science and Math while exploring robotics, experiments, and exciting hands-on activities.
                </p>
                <ul className="mt-auto space-y-1.5">
                  {['Hands-on Science Activities', 'STEM Mentoring', 'Annual Science & Technology Fair'].map((item) => (
                    <li key={item} className="text-[11px] text-[#CBD5E1] flex items-center gap-1.5">
                      <svg className="w-2.5 h-2.5 text-[#F59E0B] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative bg-[#1E293B] min-h-[200px] hidden md:block">
                <img src="/images/selfhost/nnFwumF.png" alt="Robotics Lab" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-3 right-3 bg-[#0F172A]/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" /></svg>
                  Hands-on Science Lab
                </div>
              </div>
            </div>

            {/* Language & Arts Column */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#071F43] rounded-2xl p-8 text-white">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-5 text-lg">💬</div>
                <div className="text-[11px] uppercase tracking-wide text-[#F59E0B] font-bold mb-1">Language & Arts</div>
                <h3 className="text-[18px] font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>Languages & Cultural Arts</h3>
                <p className="text-[12px] text-[#94A3B8] leading-[1.5]">
                  Improve communication skills in English, Filipino, and Mandarin while learning about different cultures through art, speaking, and performance.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[180px]">
                <img src="/images/selfhost/nnFwaqv.png" alt="Stage Event" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-3 left-3 bg-[#0F172A]/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px]">
                  Speech &amp; Cultural Oratory
                </div>
                <div className="absolute bottom-3 right-3 bg-[#0F172A]/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.665 6.023 6.023 0 01-2.77-.665" /></svg>
                  Regional Awardees
                </div>
              </div>
            </div>
          </div>

          {/* ADDED CARDS START HERE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            {/* Card 1: Technology & Practical Skills */}
            <div className="bg-[#061838] rounded-3xl p-8 md:p-10 flex flex-col justify-between text-white shadow-xl">
              <div>
                {/* Top Icon Placeholder Box */}
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <svg className="w-7 h-7 text-[#061838]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l3 3-3 3M13 15h4" />
                  </svg>
                </div>

                {/* Category Tag */}
                <h3 className="text-[#e5a93c] font-bold text-xs uppercase tracking-wider mb-3">
                  TECHNOLOGY & PRACTICAL SKILLS
                </h3>

                {/* Main Title */}
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Technology & Practical Skills
                </h2>

                {/* Subtitle */}
                <h4 className="text-white text-base md:text-lg font-bold mb-4">
                  Coding, Computers & Practical Skills
                </h4>

                {/* Description */}
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg mb-10">
                  Learn useful computer, technology, and practical skills through coding, digital projects, and hands-on activities.
                </p>
              </div>

              {/* Feature Chips / Bottom Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chip 1 */}
                <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#e5a93c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
                    </svg>
                    <h5 className="font-bold text-sm text-[#061838]">Coding & Programming</h5>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium pl-7">
                    Learn Coding Through Fun Activities
                  </p>
                </div>

                {/* Chip 2 */}
                <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#e5a93c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h5 className="font-bold text-sm text-[#061838]">Practical Skills</h5>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium pl-7">
                    Explore Real-Life Skills & Projects
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Growing Beyond the Classroom */}
            <div className="bg-[#061838] rounded-3xl overflow-hidden flex flex-col md:flex-row text-white shadow-xl">
              {/* Left Column Text Content */}
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-600/80 bg-slate-800/40 text-[11px] font-bold tracking-wider text-slate-200 uppercase mb-6">
                    <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>LEARN • GROW • LEAD</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Growing Beyond the<br />Classroom
                  </h2>

                  {/* Paragraph */}
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                    We help students become confident, responsible, and caring individuals through sports, activities, community projects, and school events.
                  </p>

                  {/* Divider */}
                  <div className="border-b border-slate-700/60 mb-6"></div>

                  {/* List Items */}
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#e5a93c] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-200">DepEd Aligned Curriculum</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#e5a93c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-200">Learn 3 Languages</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#e5a93c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="12" rx="2" />
                        <path d="M2 20h20" />
                      </svg>
                      <span className="text-sm font-medium text-slate-200">Hands-on Technology Learning</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column Image Placeholder */}
              <div className="w-full md:w-1/2 min-h-[340px] relative bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C]">
                <img 
                  src="/images/selfhost/nnKUkjp.jpg" 
                  alt="Students learning and engaging in activities placeholder image" 
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
          </div>
          {/* ADDED CARDS END HERE */}
          
        </section>

        {/* White Banner Section */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[11px] font-semibold uppercase mb-5 w-fit">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Junior High School
            </span>
            <h2 className="text-[26px] md:text-[28px] font-bold text-[#0F172A] leading-[1.3] mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
              A Place to Learn, Grow, and Belong
            </h2>
            <p className="text-[14px] text-[#475569] leading-[1.6] mb-8">
              Give your child a supportive school environment where they can build confidence, make friends, discover their talents, and prepare for the future.
            </p>
            <div className="flex gap-5 text-[12px] text-[#475569]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#071F43]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                DepEd Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#071F43]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                Learn 3 Languages
              </span>
            </div>
          </div>
          <div className="relative bg-[#CBD5E1] min-h-[300px] md:min-h-[350px]">
            <img src="/images/selfhost/nnFwKzu.png" alt="CEC Campus" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-4 right-4 bg-[#0F172A]/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              Grade 7–10 Collaborative Labs
            </div>
          </div>
        </section>

        {/* CTA Bar */}
        <section className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-8 md:px-10 flex flex-col md:flex-row justify-between items-center gap-5 mb-10">
          <div>
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#071F43] mb-1.5" style={{ fontFamily: "'Merriweather', serif" }}>
              Ready to join the Easternian family?
            </h3>
            <p className="text-[13px] text-[#475569]">Enrollment for incoming Grade 7 and transferees is now open. Give your child the opportunity to learn, grow, and prepare for a brighter future.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="/enrollment/junior-high" className="bg-[#071F43] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#0B1F3A] transition-colors">
              Admissions Portal
            </a>
            <a href="/about" className="bg-white text-[#0F172A] border border-[#E2E8F0] px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#F8FAFC] transition-colors">
              Talk to Us
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}