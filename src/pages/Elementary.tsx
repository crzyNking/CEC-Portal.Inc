import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Elementary() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#334155] overflow-x-hidden">
      <Header />

      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">

        {/* Hero */}
        <section className="bg-[#0B1F3A] rounded-[20px] overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-[60px] shadow-[0_10px_25px_rgba(11,37,89,0.15)]">
          <div className="px-8 py-12 md:px-12 flex flex-col justify-center">
            <span className="inline-block bg-white/8 border border-[#FBBF24]/30 text-[#FBBF24] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase w-fit mb-6">
              ELEMENTARY DEPARTMENT
            </span>
            <h1 className="text-white text-3xl md:text-[38px] leading-[1.2] mb-6 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nurturing Young Minds for a Bright and Inspired Future
            </h1>
            <p className="text-[#CBD5E1] text-sm leading-[1.6]">
              Empowering young learners with essential literacy, foundational numeracy, holistic character building, and joyful discovery in an inclusive, supportive community.
            </p>
          </div>
          <div className="relative min-h-[280px] md:min-h-[380px]">
            <img src="https://iili.io/nnFw2e9.png" alt="Elementary Students" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* Section Heading */}
        <section className="text-center mb-10">
          <h2 className="text-[#0F172A] text-[28px] md:text-[36px] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Academic Programs</h2>
          <p className="text-[#64748B] text-base italic" style={{ fontFamily: "'Playfair Display', serif" }}>Comprehensive primary education programs designed to inspire curiosity, values, and strong academic foundations.</p>
        </section>

        {/* Programs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1: Primary Division */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row">
            <div className="flex-1 p-8">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 text-base">🔖</div>
              <h3 className="text-[#0F172A] text-[22px] font-bold mb-1.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', serif" }}>Primary Division</h3>
              <p className="text-[#334155] text-xs font-bold mb-4">Grades 1 – 3: Literacy, Numeracy, & Discovery</p>
              <p className="text-[#64748B] text-xs leading-[1.6]">
                For young children building core mastery in reading, math fluency, and scientific inquiry. Emphasizes interactive learning tools, sensory discovery, and expressive communication.
              </p>
            </div>
            <div className="md:w-[45%] min-h-[200px]">
              <img src="https://iili.io/nnFjy0l.png" alt="Primary Division Students" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Card 2: Intermediate Division */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col">
            <div className="h-[220px]">
              <img src="https://iili.io/nnFw3be.png" alt="Intermediate Division Student" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="px-8 py-7">
              <span className="inline-block bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-5">
                GRADES 4 TO 6
              </span>
              <h3 className="text-[#0F172A] text-[22px] font-bold mb-1.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', serif" }}>Intermediate Division</h3>
              <h3 className="text-[#0F172A] text-[22px] font-bold mb-4 leading-[1.3] -mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>Inquiry-Based Science, Logic & Creative Expression</h3>
              <p className="text-[#64748B] text-xs leading-[1.6]">
                Cultivating critical thinking, research proficiency, and leadership. Prepares students seamlessly for higher learning through integrated robotics, analytical math, and bilingual communication.
              </p>
            </div>
          </div>

          {/* Card 3: Holistic & Values Formation */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="p-8">
              <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-5 text-base">🎓</div>
              <h3 className="text-[#0F172A] text-[22px] font-bold mb-1.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', serif" }}>Holistic & Values Formation</h3>
              <p className="text-[#334155] text-xs font-bold mb-4">Filipino-Chinese Cultural Heritage & Character Ethics</p>
              <p className="text-[#64748B] text-xs leading-[1.6] mt-10">
                Rooted in our deep heritage of discipline, filial piety, mutual respect, and civic duty. Students develop integrity, emotional resilience, and cross-cultural appreciation through active community service and cultural celebrations.
              </p>
            </div>
          </div>

          {/* Card 4: Enriched Learning & Co-Curricular */}
          <div className="bg-[#0B1F3A] rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row">
            <div className="flex-1 p-8 text-white">
              <span className="inline-block bg-white/8 border border-[#FBBF24]/30 text-[#FBBF24] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-5">
                REAL-WORLD READY
              </span>
              <h3 className="text-[22px] font-bold mb-4 leading-[1.3]" style={{ fontFamily: "'Playfair Display', serif" }}>Enriched Learning & Co-Curricular</h3>
              <p className="text-[#CBD5E1] text-xs leading-[1.6] mt-4">
                100+ hours of speech fest, interactive science fairs, coding clubs, sports clinics, and artistic presentations designed to inspire self-confidence and teamwork from an early age.
              </p>
            </div>
            <div className="md:w-[45%] min-h-[200px]">
              <img src="https://iili.io/nnFw2e9.png" alt="Co-Curricular Activities" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

        </section>

        {/* CTA */}
        <section className="mt-10 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_15px_rgba(0,0,0,0.02)] p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#0B1F3A] text-[20px] font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to enroll your child?</h3>
            <p className="text-[#64748B] text-[13px]">Enrollment for Grades 1 to 6 and transferees is now open. Be an Easternian today!</p>
          </div>
          <a href="/enrollment/elementary" className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#081633] transition-colors shrink-0">
            Enroll Now
          </a>
        </section>

      </main>

      <Footer />
    </div>
  )
}
