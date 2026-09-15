import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SeniorHigh() {
  return (
    <div className="min-h-screen bg-white text-[#222222] overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto flex flex-col md:flex-row px-6 md:px-10 mt-9">
        <div className="flex-1 bg-[#0B1F3A] text-white px-8 py-11 md:px-10 flex flex-col justify-center gap-3.5">
          <span className="self-start border border-[#D4C079] text-[#E8DFAE] text-[10px] tracking-widest px-3 py-1.5 rounded-sm">
            SENIOR HIGH SCHOOL
          </span>
          <h1 className="text-[26px] md:text-[32px] text-[#E8DFAE] font-bold leading-[1.25]">
            Bridging Education to Careers and Higher Learning
          </h1>
          <p className="text-[13px] text-[#D6DDEF] leading-[1.6] max-w-[420px]">
            Equipping students with industry-relevant skills, critical thinking, and a strong ethical foundation to excel in specialized fields and leading universities globally.
          </p>
        </div>
        <div className="flex-1 relative min-h-[280px] md:min-h-[340px]">
          <img src="https://iili.io/nnFwMmX.png" alt="Senior High Students" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute bottom-2.5 right-3.5 text-[10px] text-white/80 z-10">
            Facebook.com/CEC...
          </div>
        </div>
      </section>

      {/* Academic Tracks */}
      <section className="bg-[#F4F5F8] px-6 md:px-10 py-12 pb-15 mt-9">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[#0B1F3A] text-[22px] md:text-[26px] mb-1.5">Academic Tracks</h2>
          <p className="text-[#5A5A5A] text-[13px] mb-6">Comprehensive specialized curricula designed to align with your career aspirations and university goals.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* STEM Card */}
            <div className="bg-white rounded-md overflow-hidden flex flex-col md:flex-row shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[220px]">
              <div className="flex-1 px-6 py-6 flex flex-col gap-2">
                <div className="w-[34px] h-[34px] bg-[#0B1F3A] rounded-md flex items-center justify-center text-[#E8DFAE] text-[15px] mb-1.5">
                  👤
                </div>
                <h3 className="text-[#0B1F3A] text-[19px]">STEM</h3>
                <div className="text-[#D4C079] text-[11px] font-semibold tracking-wide uppercase">Science, Technology, Engineering, and Mathematics</div>
                <p className="text-[#5A5A5A] text-[12.5px] leading-[1.6] mt-1">
                  For students pursuing degrees in medicine, engineering, computer science, and pure sciences. Features advanced laboratory facilities and research-driven methodologies.
                </p>
              </div>
              <div className="flex-1 relative min-h-[160px]">
                <img src="https://iili.io/nnFwWIn.png" alt="STEM Lab" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-2 left-0 right-0 text-center text-[#8A90A0] font-bold text-[11px] tracking-[2px]">STEM</div>
              </div>
            </div>

            {/* ABM Card */}
            <div className="bg-white rounded-md overflow-hidden flex flex-col md:flex-row shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[220px]">
              <div className="flex-1 relative min-h-[160px] order-1">
                <img src="https://iili.io/nnFwhLG.png" alt="ABM" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-2 left-0 right-0 text-center text-[#8A90A0] font-bold text-[11px] tracking-[2px]">ABM</div>
              </div>
              <div className="flex-1 px-6 py-6 flex flex-col gap-2 order-2">
                <div className="w-[34px] h-[34px] bg-[#0B1F3A] rounded-md flex items-center justify-center text-[#E8DFAE] text-[15px] mb-1.5">
                  📈
                </div>
                <h3 className="text-[#0B1F3A] text-[19px]">ABM</h3>
                <div className="text-[#D4C079] text-[11px] font-semibold tracking-wide uppercase">Accountancy, Business, and Management</div>
                <p className="text-[#5A5A5A] text-[12.5px] leading-[1.6] mt-1">
                  Tailored for future entrepreneurs, corporate leaders, and financial experts focusing on core business operations.
                </p>
              </div>
            </div>

            {/* HUMSS Card */}
            <div className="bg-white rounded-md overflow-hidden flex flex-col md:flex-row shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[220px]">
              <div className="flex-1 px-6 py-6 flex flex-col gap-2">
                <div className="w-[34px] h-[34px] bg-[#0B1F3A] rounded-md flex items-center justify-center text-[#E8DFAE] text-[15px] mb-1.5">
                  📍
                </div>
                <h3 className="text-[#0B1F3A] text-[19px]">HUMSS</h3>
                <div className="text-[#D4C079] text-[11px] font-semibold tracking-wide uppercase">Humanities and Social Sciences</div>
                <p className="text-[#5A5A5A] text-[12.5px] leading-[1.6] mt-1">
                  Designed for future lawyers, educators, journalists, and public servants. Emphasizes communication, critical analysis, and social awareness.
                </p>
              </div>
              <div className="flex-1 relative min-h-[160px]">
                <img src="https://iili.io/nnFwOrl.png" alt="HUMSS" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-2 left-0 right-0 text-center text-[#8A90A0] font-bold text-[11px] tracking-[2px]">HUMSS</div>
              </div>
            </div>

            {/* Premium Work Immersion Card */}
            <div className="bg-[#0B1F3A] rounded-md overflow-hidden flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[220px]">
              <span className="self-start mx-5 mt-4 bg-white/8 border border-[#D4C079] text-[#E8DFAE] text-[9px] tracking-widest px-2.5 py-1 rounded-sm">
                REAL-WORLD READY
              </span>
              <div className="flex flex-col md:flex-row flex-1">
                <div className="flex-1 px-6 py-3.5 md:py-5 text-white flex flex-col justify-center gap-2">
                  <h3 className="text-[19px] text-white">Premium Work Immersion</h3>
                  <p className="text-[12.5px] text-[#C9D1E8] leading-[1.6]">
                    80+ hours of hands-on industry training with our network of top-tier corporate partners, tech firms, and medical institutions.
                  </p>
                </div>
                <div className="flex-1 relative min-h-[160px]">
                  <img src="https://iili.io/nnFwOrl.png" alt="Work Immersion" className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute top-4 right-4 text-[18px] opacity-70">📺</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-white rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-7 flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-[#0B1F3A] text-[18px] mb-1">Ready to join the Easternian family?</h3>
              <p className="text-[#5A5A5A] text-[13px]">Enrollment for incoming Grade 11 and transferees is now open.</p>
            </div>
            <a href="/enrollment/senior-high" className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-md text-[13px] font-semibold hover:bg-[#081537] transition-colors shrink-0">
              Enroll Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
