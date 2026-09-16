import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BSTM() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#333333] overflow-x-hidden">
      <Header />

      <div className="max-w-[1140px] mx-auto px-5">

        {/* Hero Banner */}
        <header className="bg-[#0B2046] rounded-2xl overflow-hidden flex flex-col md:flex-row mt-4 mb-9 text-white">
          <div className="flex-1 px-8 py-11 md:px-10 flex flex-col justify-center">
            <span className="inline-block border border-[#D69E2E] text-[#D69E2E] text-[9px] font-bold tracking-[1.2px] px-3 py-1 rounded-full uppercase w-fit mb-5">
              College of Tourism Management - S.Y. 2024-2025
            </span>
            <h1 className="text-[28px] md:text-[34px] leading-[1.15] font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Master Global Tourism & World-Class Hospitality
            </h1>
            <p className="text-[11px] text-[#A0AEC0] leading-[1.6] max-w-[420px] mb-6">
              Cebu Eastern College offers premier tourism and hospitality education designed to cultivate global industry leaders, combining hands-on airline GDS training, multilingual fluency, and world-class practicum immersion.
            </p>
            <a href="/enrollment/college" className="inline-block bg-[#FFB703] text-[#0B1C48] text-[10px] font-bold px-5 py-2.5 rounded-full uppercase tracking-wide w-fit hover:bg-[#E5A52E] transition-colors">
              ENROLL NOW!
            </a>
          </div>
          <div className="flex-1 relative bg-[#1A202C] min-h-[260px] md:min-h-[320px]">
            <img src="https://iili.io/noH2yVp.png" alt="Tourism Management Students & Campus" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </header>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#0B1F3A] text-[24px] md:text-[26px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bachelor of Science in Tourism Management (BSTM)</h2>
          <p className="text-[12px] text-[#718096] italic mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Now Accepting Enrollees | Be a Globally Competitive Easternian Today!</p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">

          {/* Card 1: Programs Offered & Industry Certifications */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row">
            <div className="md:flex-[1.2] p-6 flex flex-col">
              <div className="w-7 h-7 bg-[#EBF8FF] text-[#3182CE] rounded-md flex items-center justify-center text-xs mb-4">📖</div>
              <h4 className="text-[#1A202C] text-base font-bold mb-2 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Programs Offered & Industry Certifications</h4>
              <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
                Comprehensive 4-year collegiate degree featuring Amadeus/Sabre GDS certification, tour guiding licenses, and foreign language proficiency.
              </p>
              <div className="text-[9px] font-bold text-[#A0AEC0] tracking-wider uppercase mb-2 mt-auto">MAJORS & SPECIALIZED TRACKS</div>
              <ul className="flex flex-col gap-1.5">
                {['Airline & Airport Operations', 'Travel & Tour Management', 'Hospitality & Resort Operations'].map((item) => (
                  <li key={item} className="text-[11px] text-[#4A5568] flex items-center gap-1.5">
                    <span className="text-[#D69E2E] text-xs leading-none">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:flex-1 relative min-h-[180px]">
              <img src="https://iili.io/nnFwtkP.png" alt="Flight Attendants Uniform" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </article>

          {/* Card 2: Mock Hotel & Aviation Simulation Laboratories */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="h-[180px]">
              <img src="https://iili.io/nnFwyQa.png" alt="Large Student Group Assembly" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="inline-block border border-[#FBD38D] text-[#DD6B20] text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase w-fit mb-3">
                EXCLUSIVE FACILITIES
              </span>
              <h4 className="text-[#1A202C] text-base font-bold mb-2 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Mock Hotel & Aviation Simulation Laboratories</h4>
              <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
                State-of-the-art mock aircraft cabin, airline reservation lab, and banquet suites designed for authentic industry practice.
              </p>
              <a href="#" className="text-[#4A5568] text-[11px] font-bold flex items-center gap-1.5 mt-auto">
                <span>Explore Our Campus Facilities</span>
                <span className="text-[#FFB703]">→</span>
              </a>
            </div>
          </article>

          {/* Card 3: Why Choose CEC Tourism Management? */}
          <article className="border border-[#EDF2F7] rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-6 flex flex-col">
            <div className="w-7 h-7 bg-[#FFFAF0] text-[#DD6B20] rounded-md flex items-center justify-center text-xs mb-4">🎓</div>
            <h4 className="text-[#1A202C] text-base font-bold mb-2 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Why Choose CEC Tourism Management?</h4>
            <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
              Empowering future global hoteliers, flight attendants, and tourism entrepreneurs through industry-grade training and international standards.
            </p>
            <div className="text-[9px] font-bold text-[#A0AEC0] tracking-wider uppercase mb-2 mt-auto">KEY HIGHLIGHTS</div>
            <ul className="flex flex-col gap-2">
              {['DOT-Accredited & Certified Industry Faculty', 'Affordable Tuition Fees with Flexible Payment Schemes & Discounts', '600+ Hours Local & International Practicum Partnerships'].map((item) => (
                <li key={item} className="text-[11px] text-[#4A5568] flex items-center gap-1.5">
                  <span className="text-[#2D3748] text-xs leading-none">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* Card 4: A Legacy of Hospitality Excellence */}
          <article className="bg-[#0B2046] text-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
            <div className="md:flex-[1.2] p-6 flex flex-col">
              <span className="inline-block border border-[#D69E2E] text-[#D69E2E] text-[8px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase w-fit mb-3.5">
                CEC EXCELLENCE • 109 YEARS
              </span>
              <h4 className="text-lg font-bold leading-[1.25] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                A Legacy of Hospitality Excellence
              </h4>
              <p className="text-[11px] text-[#A0AEC0] leading-[1.5] mb-5">
                Over a century of commitment to quality Filipino-Chinese education and global industry readiness right here in Cebu City.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2.5 flex items-center gap-2.5 mt-auto">
                <span className="text-[#D69E2E] text-xs">✓</span>
                <p className="text-[10px] text-[#CBD5E0] leading-[1.3]">CHED-Recognized Curriculum & Global Travel Ties</p>
              </div>
            </div>
            <div className="md:flex-1 min-h-[180px]">
              <img src="https://iili.io/nnFNJEv.png" alt="Campus Building" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </article>
        </div>

        {/* CTA */}
        <section className="mt-6 bg-white border border-[#EDF2F7] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#0B1F3A] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to start your BSTM journey?</h3>
            <p className="text-[#718096] text-[13px]">Enrollment for the College of Tourism Management is now open.</p>
          </div>
          <a href="/enrollment/college" className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#0B1C48] transition-colors shrink-0">
            Enroll Now
          </a>
        </section>

      </div>

      <Footer />
    </div>
  )
}
