import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SeniorHigh() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#2C3E50] overflow-x-hidden">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-5 py-8 sm:py-10">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row rounded-xl overflow-hidden mb-10 sm:mb-[60px] shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
          <div className="flex-1 bg-[#0B1F3A] text-white px-6 py-10 sm:px-10 sm:py-12 md:px-[50px] md:py-[60px] flex flex-col justify-center">
            <span className="inline-block border border-[#D6B265] text-[#D6B265] text-[0.65rem] sm:text-[0.7rem] font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-5 self-start tracking-wider">
              SENIOR HIGH SCHOOL
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[2.8rem] leading-[1.2] mb-4 sm:mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#FDF1D6' }}>
              Bridging Education to Careers and Higher Learning
            </h2>
            <p className="text-[0.85rem] sm:text-[0.95rem] leading-[1.6] text-[#E5E7EB]">
              Equipping students with industry-relevant skills, critical thinking, and a strong ethical foundation to excel in specialized fields and leading universities globally.
            </p>
          </div>
          <div className="h-48 sm:h-64 md:h-auto md:flex-1 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }} />
        </section>

        {/* Academic Tracks */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-[2rem] mb-2.5" style={{ fontFamily: "'Playfair Display', serif", color: '#0B1F3A' }}>Academic Tracks</h2>
            <p className="text-[#6B7280] text-[0.8rem] sm:text-[0.9rem]">Comprehensive specialized curriculums designed to align with your career aspirations and university goals.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* STEM Card */}
            <div className="lg:col-span-8 bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row">
              <div className="flex-1 p-6 sm:p-10">
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center mb-4 text-[#1C3A6B]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="text-[1.3rem] sm:text-[1.5rem] mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#0B1F3A' }}>STEM</h3>
                <h4 className="text-[0.75rem] sm:text-[0.8rem] font-semibold mb-4 text-[#1E4E8C]">Science, Technology, Engineering, and Mathematics</h4>
                <p className="text-[#6B7280] text-[0.8rem] sm:text-[0.85rem] leading-[1.6]">
                  For students pursuing degrees in medicine, engineering, computer science, and pure sciences. Features advanced laboratory facilities and research-driven methodologies.
                </p>
              </div>
              <div className="h-48 sm:h-auto sm:flex-1 bg-cover bg-center relative min-h-[200px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')" }}>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#EF4444] to-transparent text-white text-center py-5 pb-2.5 text-[1.3rem] sm:text-[1.5rem] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  STEM
                </div>
              </div>
            </div>

            {/* ABM Card */}
            <div className="lg:col-span-4 bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col">
              <div className="h-44 sm:h-[180px] bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')" }}>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#D6B265] to-transparent text-black text-center py-5 pb-1.25 text-[1.3rem] sm:text-[1.5rem] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ABM
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center mb-4 text-[#1C3A6B]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                </div>
                <h3 className="text-[1.3rem] sm:text-[1.5rem] mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#0B1F3A' }}>ABM</h3>
                <h4 className="text-[0.75rem] sm:text-[0.8rem] font-semibold mb-4 text-[#1E4E8C]">Accountancy, Business, and Management</h4>
                <p className="text-[#6B7280] text-[0.8rem] sm:text-[0.85rem] leading-[1.6]">
                  Tailored for future entrepreneurs, corporate leaders, and financial experts focusing on core business operations.
                </p>
              </div>
            </div>

            {/* HUMSS Card */}
            <div className="lg:col-span-6 bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] p-6 sm:p-10 relative">
              <div className="absolute top-0 right-0 w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] opacity-50 rounded-bl-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #F3F4F6 10px, #F3F4F6 20px)' }} />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center mb-4 text-[#1C3A6B]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </div>
                <h3 className="text-[1.3rem] sm:text-[1.5rem] mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#0B1F3A' }}>HUMSS</h3>
                <h4 className="text-[0.75rem] sm:text-[0.8rem] font-semibold mb-4 text-[#1E4E8C]">Humanities and Social Sciences</h4>
                <p className="text-[#6B7280] text-[0.8rem] sm:text-[0.85rem] leading-[1.6]">
                  Designed for future lawyers, educators, journalists, and public servants. Emphasizes communication, critical analysis, and social awareness.
                </p>
              </div>
            </div>

            {/* Immersion Card */}
            <div className="lg:col-span-6 bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row">
              <div className="flex-1 bg-[#0B1F3A] text-white p-6 sm:p-10">
                <span className="inline-block border border-[#D6B265] text-[#D6B265] text-[0.65rem] sm:text-[0.7rem] font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4 tracking-wider">
                  REAL-WORLD READY
                </span>
                <h3 className="text-[1.3rem] sm:text-[1.5rem] my-3 sm:my-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Work Immersion</h3>
                <p className="text-[#D1D5DB] text-[0.8rem] sm:text-[0.85rem] leading-[1.6]">
                  80+ hours of hands-on industry training with our network of top-tier corporate partners, tech firms, and medical institutions.
                </p>
              </div>
              <div className="h-48 sm:h-auto sm:flex-1 bg-cover bg-center min-h-[200px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')" }} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
