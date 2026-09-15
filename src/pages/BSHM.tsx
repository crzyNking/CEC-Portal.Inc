import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BSHM() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#333333] overflow-x-hidden">
      <Header />

      <div className="max-w-[1140px] mx-auto px-5">

        {/* Hero Banner */}
        <header className="bg-[#0B2046] rounded-2xl overflow-hidden flex flex-col md:flex-row mt-4 mb-9 text-white">
          <div className="flex-1 px-8 py-11 md:px-10 flex flex-col justify-center">
            <span className="inline-block border border-[#D69E2E] text-[#D69E2E] text-[9px] font-bold tracking-[1.2px] px-2.5 py-1 rounded-full uppercase w-fit mb-5">
              College of Hospitality Management - A.Y. 2024-2025
            </span>
            <h1 className="text-[26px] md:text-[32px] leading-[1.15] font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Master Global Hospitality & World-Class Hotel Management
            </h1>
            <p className="text-[11px] text-[#A0AEC0] leading-[1.6] max-w-[420px]">
              Cebu Eastern College offers premier hospitality education designed to cultivate industry leaders, combining hands-on culinary & hotel training, Opera PMS simulation, and world-class practicum immersion.
            </p>
          </div>
          <div className="flex-1 relative bg-[#1A202C] min-h-[260px] md:min-h-[300px]">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" alt="Hospitality Management Banquet Hall" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1.5 backdrop-blur-sm">
              <span className="font-bold">f</span>
              <span>/alumnipublicationcec</span>
            </div>
          </div>
        </header>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#0B1F3A] text-[22px] md:text-[24px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bachelor of Science in Hospitality Management (BSHM)</h2>
          <p className="text-[11px] text-[#718096] italic mt-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Now Accepting Enrollees | Be a Globally Competitive Hotelier & Hospitality Leader Today!</p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Card: Mock Hotel & Dining */}
            <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col">
              <div className="h-[160px]">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" alt="Students in Hospitality Uniform" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="inline-block border border-[#ED8936] text-[#DD6B20] text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm uppercase mb-2">
                  EXCLUSIVE FACILITIES
                </span>
                <h4 className="text-[#1A202C] text-[13px] font-bold mb-1.5">Mock Hotel & Commercial Dining Simulation Laboratories</h4>
                <p className="text-[11px] text-[#718096] leading-[1.5] mb-4">
                  State-of-the-art mock hotel suite, front office reservation lab, commercial culinary kitchens, and banquet hall designed for authentic industry practice.
                </p>
                <a href="#" className="text-[#0066FF] text-[11px] font-semibold flex items-center justify-between max-w-[160px]">
                  <span>Explore Our Campus Facilities</span>
                  <span>→</span>
                </a>
              </div>
            </article>

            {/* Card: Why Choose */}
            <article className="border border-[#EDF2F7] rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-5 flex-1">
              <div className="w-6 h-6 bg-[#FEEBC8] text-[#DD6B20] rounded-md flex items-center justify-center text-[11px] mb-3">✓</div>
              <h4 className="text-[#1A202C] text-[13px] font-bold mb-1.5">Why Choose CEC Hospitality Management?</h4>
              <p className="text-[11px] text-[#718096] leading-[1.5] mb-3">
                Empowering future hoteliers, culinary experts, and tourism entrepreneurs through industry-grade training and international standards.
              </p>
              <div className="text-[9px] font-bold text-[#A0AEC0] tracking-wider uppercase mb-2">KEY HIGHLIGHTS</div>
              <ul className="flex flex-col gap-1.5">
                {[
                  'CHED-Recognized & Certified Industry Practitioner Faculty',
                  'Affordable Tuition Fees with Flexible Payment Schemes & Discounts',
                  '600+ Hours Local & International Practicum Partnerships (USA, Japan, Dubai)',
                ].map((item) => (
                  <li key={item} className="text-[11px] text-[#4A5568] flex items-start gap-2">
                    <span className="text-[#0066FF] text-[10px] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {/* Card: Three ways to specialize */}
            <article className="border border-[#EDF2F7] rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-7">
              <h3 className="text-[#1A202C] text-[22px] font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Three ways to specialize</h3>
              <div className="text-[11px] text-[#4A5568] font-semibold mb-5">Every BSHM student builds a shared foundation, then chooses where to go deep.</div>

              <div className="mb-4">
                <h4 className="text-[#2D3748] text-[13px] font-bold mb-0.5">1. Hotel and resort operations</h4>
                <p className="text-[11px] text-[#718096] leading-[1.5]">Front office, housekeeping, and guest services — run through real check-in and room-service scenarios in the mock hotel lab.</p>
              </div>

              <div className="mb-4">
                <h4 className="text-[#2D3748] text-[13px] font-bold mb-0.5">2. Culinary arts and kitchen operations</h4>
                <p className="text-[11px] text-[#718096] leading-[1.5]">Knife skills to full menu planning, working the line in our commercial dining kitchen alongside working chefs.</p>
              </div>

              <div>
                <h4 className="text-[#2D3748] text-[13px] font-bold mb-0.5">3. Hospitality and event management</h4>
                <p className="text-[11px] text-[#718096] leading-[1.5]">Planning and running weddings, conferences, and banquets, from vendor sourcing through day-of logistics.</p>
              </div>
            </article>

            {/* Card: Programs Offered */}
            <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row p-5 gap-4">
              <div className="md:flex-[1.4]">
                <div className="w-6 h-6 bg-[#EBF8FF] text-[#3182CE] rounded-md flex items-center justify-center text-[11px] mb-3">🎓</div>
                <h4 className="text-[#1A202C] text-[10px] font-bold tracking-wide uppercase mb-2">Programs Offered & Industry Certifications</h4>
                <p className="text-[11px] text-[#718096] leading-[1.5] mb-3">
                  Comprehensive 4-year collegiate degree featuring Opera PMS, Sabre, TESDA NC II/III Cookery, F&B Services, and Housekeeping credentials.
                </p>
                <div className="text-[9px] font-bold text-[#A0AEC0] tracking-wider uppercase mb-2">MAJORS & SPECIALIZED TRACKS</div>
                <ul className="flex flex-col gap-1">
                  {['Hotel & Resort Operations', 'Culinary Arts & Kitchen Operations', 'Hospitality & Event Management'].map((item) => (
                    <li key={item} className="text-[10px] text-[#4A5568] flex items-center gap-1.5">
                      <span className="text-[#0066FF] text-xs leading-none">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:flex-[0.8] h-[160px] rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80" alt="Hands-on Practice" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </article>
          </div>
        </div>

        {/* Legacy Banner */}
        <section className="bg-[#0B2046] rounded-xl overflow-hidden flex flex-col md:flex-row text-white mb-4">
          <div className="flex-1 p-8 flex flex-col justify-center">
            <span className="inline-block border border-[#D69E2E] text-[#D69E2E] text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase w-fit mb-3">
              CEC EXCELLENCE • 100+ YEARS
            </span>
            <h3 className="text-[15px] font-bold leading-[1.3] mb-2.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              A Legacy of Hospitality Excellence
            </h3>
            <p className="text-[10px] text-[#A0AEC0] leading-[1.5] mb-5 max-w-[280px]">
              Over a century of commitment to quality Filipino-Chinese education and global industry readiness right here in Cebu City.
            </p>
            <div className="bg-white/8 border border-white/15 rounded-md px-3 py-2 flex items-center gap-2.5 w-fit">
              <span className="text-[#D69E2E] text-xs">🛡️</span>
              <p className="text-[10px] text-[#E2E8F0] leading-[1.2]">CHED Recognized Curriculum & Global Travel Ties</p>
            </div>
          </div>
          <div className="md:flex-[1.2] relative min-h-[220px]">
            <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80" alt="Cebu Eastern College Building" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-4 left-4 text-white text-lg font-bold tracking-wide" style={{ fontFamily: 'serif', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              CEBUEASTERN COLLEGE 宿務東方學院
            </div>
            <div className="absolute top-10 right-5 text-white text-[11px]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Leon Kilat St., Cebu City
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-[#EDF2F7] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#0B1F3A] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to start your BSHM journey?</h3>
            <p className="text-[#718096] text-[13px]">Enrollment for the College of Hospitality Management is now open.</p>
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
