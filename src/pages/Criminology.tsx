import { usePageTitle } from '../hooks/usePageTitle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Criminology() {
  usePageTitle('BS in Criminology')
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#333333] overflow-x-hidden">
      <Header />

      <div className="max-w-[1140px] mx-auto px-5">

        {/* Hero Banner */}
        <header className="bg-[#0B2046] rounded-2xl overflow-hidden flex flex-col md:flex-row mt-4 mb-10 text-white">
          <div className="flex-1 px-8 py-12 md:px-10 flex flex-col justify-center">
            <span className="inline-block border border-[#C59B27] text-[#C59B27] text-[9px] font-bold tracking-[1.2px] px-3 py-1 rounded-full uppercase w-fit mb-6">
              College of Criminology
            </span>
            <h1 className="text-[28px] md:text-[34px] leading-[1.2] font-bold mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Bridging Discipline to Excellence in Public Safety & Justice
            </h1>
            <p className="text-[11px] text-[#A0AEC0] leading-[1.7] max-w-[420px]">
              Equipping cadets and future criminalists with industry-standard forensic methodologies, tactical leadership, and a steadfast ethical foundation to excel in national law enforcement, investigative bureaus, and global security institutions.
            </p>
          </div>
          <div className="md:flex-[1.1] relative bg-[#1A202C] min-h-[260px] md:min-h-[320px]">
            <img src="/images/selfhost/nnFNd4R.png" alt="Criminology Cadets Assembly" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </header>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-[#0B1F3A] text-[22px] md:text-[24px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Academic Tracks & Tactical Pillars</h2>
          <p className="text-[11px] text-[#718096] mt-1.5 max-w-[480px] leading-[1.5]">Comprehensive specialized curriculums designed to align with professional board exams, criminalistics expertise, and commanding officer career tracks.</p>
        </div>

        {/* Top Grid */}
        <section className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5 mb-5">

          {/* Card 1: Forensic Criminalistics */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row">
            <div className="md:flex-[1.1] p-6 flex flex-col">
              <div className="w-[30px] h-[30px] bg-[#EDF2F7] text-[#4A5568] rounded-md flex items-center justify-center text-[13px] mb-4">🔬</div>
              <h4 className="text-[#1A202C] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Forensic Criminalistics</h4>
              <div className="text-[10px] italic text-[#0B1F3A] mb-3.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ballistics, Dactyloscopy, and Questioned Documents</div>
              <p className="text-[11px] text-[#718096] leading-[1.6]">
                For students pursuing technical crime scene investigation, forensic chemistry, polygraphy, and ballistic identification. Features hands-on training with modern microscopic comparators and fingerprint analysis labs.
              </p>
            </div>
            <div className="md:flex-1 relative min-h-[180px]">
              <img src="/images/selfhost/nnFNFYN.png" alt="Physical Tactical Training" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </article>

          {/* Card 2: LEA */}
          <article className="border border-[#EDF2F7] rounded-xl overflow-hidden bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="h-[150px]">
              <img src="/images/selfhost/nnFNKvI.png" alt="Martial Arts / Defensive Tactics" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="px-6 py-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#718096]">📈</span>
                <h4 className="text-[#1A202C] text-[17px] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>LEA</h4>
              </div>
              <div className="text-[10px] italic text-[#0B1F3A] mb-2.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Police Organization, Intelligence, and Security Management</div>
              <p className="text-[11px] text-[#718096] leading-[1.6]">
                Tailored for future precinct commanders, intelligence analysts, and private security directors focusing on patrol operations, crowd control, and counter-terrorism.
              </p>
            </div>
          </article>
        </section>

        {/* Bottom Grid */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-5">

          {/* Card 3: Criminal Law & Jurisprudence */}
          <article className="border border-[#EDF2F7] rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-6 relative flex flex-col">
            <div className="absolute top-4 right-4 w-[80px] h-[50px] flex flex-col gap-1.5 opacity-12 -rotate-[30deg]" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-1.5 bg-black rounded-sm" />
              ))}
            </div>
            <div className="w-[30px] h-[30px] bg-[#EDF2F7] text-[#4A5568] rounded-md flex items-center justify-center text-[13px] mb-4">⚖️</div>
            <h4 className="text-[#1A202C] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Criminal Law & Jurisprudence</h4>
            <div className="text-[10px] italic text-[#0B1F3A] mb-3.5 leading-[1.3]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Constitutional Rights, Courtroom Procedure, and Criminal Evidence</div>
            <p className="text-[11px] text-[#718096] leading-[1.6]">
              Designed for future legal investigators, public safety officers, and judicial liaisons. Emphasizes evidence handling, due process, affidavit formulation, and courtroom testimony preparation under Philippine Criminal Jurisprudence.
            </p>
          </article>

          {/* Card 4: 540+ Hours Tactical & Police Internship */}
          <article className="bg-[#0B2046] text-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
            <div className="md:flex-[1.1] p-6 flex flex-col">
              <span className="inline-block border border-[#C59B27] text-[#C59B27] text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase w-fit mb-3.5">
                FIELD READINESS
              </span>
              <h4 className="text-lg font-bold leading-[1.25] mb-3.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                540+ Hours Tactical & Police Internship
              </h4>
              <p className="text-[11px] text-[#A0AEC0] leading-[1.6]">
                Hands-on immersion and precinct rotations with our partner network of Philippine National Police (PNP) stations, BJMP detention centers, and accredited crime laboratories.
              </p>
            </div>
            <div className="md:flex-1 relative min-h-[180px]">
              <img src="/images/selfhost/nnFNfpt.png" alt="Crime Scene Investigation Demo" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </article>
        </section>

        {/* CTA */}
        <section className="mt-8 bg-white border border-[#EDF2F7] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#0B1F3A] text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to start your Criminology journey?</h3>
            <p className="text-[#718096] text-[13px]">Enrollment for the College of Criminology is now open.</p>
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
