import { usePageTitle } from '../hooks/usePageTitle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BSIT() {
  usePageTitle('BS in Information Technology')
  return (
    <div className="min-h-screen bg-white text-[#333333] overflow-x-hidden">
      <Header />

      <div className="max-w-[1140px] mx-auto px-5">

        {/* Hero Banner */}
        <header className="bg-[#0B2046] rounded-2xl overflow-hidden flex flex-col md:flex-row mt-4 mb-10 text-white">
          <div className="flex-1 px-8 py-11 md:px-10 flex flex-col justify-center">
            <span className="inline-block border border-[#D69E2E] text-[#D69E2E] text-[10px] font-bold tracking-[1.2px] px-3 py-1 rounded-full uppercase w-fit mb-5">
              College of Information Technology
            </span>
            <h1 className="text-[28px] md:text-[34px] leading-[1.15] font-bold mb-4.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Bridging Code to Careers and Tech Leadership
            </h1>
            <p className="text-xs text-[#A0AEC0] leading-[1.6] mb-8 max-w-[420px]">
              Equipping aspiring software engineers and IT specialists with hands-on systems architecture, cloud infrastructure, and cybersecurity mastery to thrive in global tech enterprises.
            </p>
            <div className="flex gap-8 border-t border-white/10 pt-5">
              <div>
                <h4 className="text-[13px] font-bold text-white">CHED Recognized</h4>
                <p className="text-[10px] text-[#718096]">BSIT Degree Program</p>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">100% Industry Practicum</h4>
                <p className="text-[10px] text-[#718096]">Cebu IT Park Partners</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative bg-[#1A202C] min-h-[280px] md:min-h-[320px]">
            <img src="/images/selfhost/nnFw8k7.png" alt="Students in Computer Lab" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1.5 backdrop-blur-sm">
              <span className="font-bold">f</span>
              <span>facebook.com/CECSince1915</span>
            </div>
          </div>
        </header>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-[#0B1F3A] text-[22px] md:text-[24px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>BSIT Specialization Tracks</h2>
          <p className="text-[11px] text-[#5A6A85] mt-1">Comprehensive specialized curriculums designed to align with your career aspirations and global computing standards.</p>
        </div>

        {/* Top Tracks Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* Track 1: Software Engineering */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row">
            <div className="md:flex-[1.2] p-6 flex flex-col">
              <div className="w-8 h-8 bg-[#0066FF] text-white rounded-md flex items-center justify-center font-bold text-sm mb-4">{'</>'}</div>
              <h3 className="text-[#1A202C] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Software Engineering</h3>
              <div className="text-[9px] font-bold text-[#718096] tracking-wide uppercase mb-3">Full-Stack, Cloud Native & Mobile Architecture</div>
              <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
                Designed for students pursuing careers in software architecture, modern web frameworks, and cross-platform app ecosystems. Features modern computer labs, Git workflows, and API design.
              </p>
              <div className="border-t-2 border-[#0066FF] pt-2.5 mt-auto text-[11px] text-[#4A5568]">
                <strong className="text-[#2D3748]">Core:</strong> React, Python, Java, PostgreSQL & Docker
              </div>
            </div>
            <div className="md:flex-[0.8] relative min-h-[180px]">
              <img src="/images/selfhost/nnpwbSV.jpg" alt="Software Dev Lab" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <span className="text-[9px] text-white shadow-md bg-black/40 px-1.5 py-0.5 rounded">Software Dev Lab 02</span>
                <span className="bg-[#0066FF] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase">DEV</span>
              </div>
            </div>
          </article>

          {/* Track 2: Cybersecurity & Networks */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="h-[140px] relative">
              <img src="/images/selfhost/nnFwSp9.png" alt="Cybersecurity Team" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[11px] tracking-[2px] font-bold uppercase bg-black/50 px-3 py-1 rounded">
                Cybersec & Networking
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#4A5568]">📁</span>
                <h3 className="text-[#1A202C] text-base font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Cybersecurity & Networks</h3>
              </div>
              <div className="text-[9px] font-bold text-[#718096] tracking-wide uppercase mb-3">Cisco Routing, Cloud Infrastructure & Threat Analysis</div>
              <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
                Tailored for future cybersecurity engineers, sysadmins, and network architects focusing on zero-trust frameworks, packet analysis, and enterprise server maintenance.
              </p>
              <div className="border-t-2 border-[#0066FF] pt-2.5 mt-auto flex justify-between items-center text-[11px] text-[#718096]">
                <span>Includes CCNA Preparation</span>
                <span className="text-[#059669] font-bold">In-demand Track</span>
              </div>
            </div>
          </article>
        </section>

        {/* Bottom Tracks Grid */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-5">

          {/* Track 3: Data Science & Analytics */}
          <article className="bg-[#FCFCFC] p-6 relative rounded-xl border border-[#EDF2F7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="absolute top-4 right-4 w-[90px] h-[60px] grid grid-cols-3 gap-[5px] opacity-15" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-black rounded-sm" />
              ))}
            </div>
            <div className="w-8 h-8 bg-[#0066FF] text-white rounded-md flex items-center justify-center font-bold text-sm mb-4">✓</div>
            <h3 className="text-[#1A202C] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Data Science & Analytics</h3>
            <div className="text-[9px] font-bold text-[#718096] tracking-wide uppercase mb-3">Big Data, Machine Learning & Business Intelligence</div>
            <p className="text-[11px] text-[#718096] leading-[1.5] mb-5">
              Designed for future data analysts, ETL developers, and AI assistants. Emphasizes enterprise data warehousing, statistical modeling, data visualization, and predictive decision systems.
            </p>
            <div className="border-t-2 border-[#0066FF] pt-2.5 mt-auto text-[11px] text-[#4A5568]">
              <span className="inline-block w-1.5 h-1.5 bg-[#ECC94B] rounded-full mr-1.5" />
              <strong className="text-[#2D3748]">Tools:</strong> SQL, Tableau, PowerBI, Python Pandas
            </div>
          </article>

          {/* Track 4: Premium Tech Immersion & Practicum */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row">
            <div className="md:flex-[1.2] p-6 flex flex-col">
              <span className="inline-block border border-[#FBD38D] text-[#D69E2E] text-[9px] font-bold tracking-wide px-2.5 py-0.5 rounded-full uppercase w-fit mb-4">
                Real-World Ready
              </span>
              <h3 className="text-[#1A202C] text-[17px] font-bold mb-2.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Premium Tech Immersion & Practicum</h3>
              <p className="text-[11px] text-[#718096] leading-[1.5] mt-2.5 mb-5">
                486+ hours of specialized on-the-job training with Cebu IT Park software hubs, multinational business process corporations, and partner tech startups.
              </p>
              <div className="border-t-2 border-[#0066FF] pt-2.5 mt-auto flex justify-between items-center text-[11px] text-[#718096]">
                <span>Direct Corporate Placement</span>
                <span className="text-[#059669] font-bold">98% Employment Rate</span>
              </div>
            </div>
            <div className="md:flex-[0.8] relative min-h-[180px]">
              <img src="/images/selfhost/nnFwgIe.png" alt="Tech Immersion" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[8px] px-2 py-0.5 rounded-sm whitespace-nowrap">
                Capstone Project Defense
              </div>
            </div>
          </article>
        </section>

        {/* CTA */}
        <section className="mt-8 bg-[#FCFCFC] border border-[#EDF2F7] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#0B1F3A] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to start your BSIT journey?</h3>
            <p className="text-[#5A6A85] text-[13px]">Enrollment for the College of Information Technology is now open.</p>
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
