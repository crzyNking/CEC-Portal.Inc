import { usePageTitle } from '../hooks/usePageTitle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
  usePageTitle('About Us')
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <Header />

      {/* Hero */}
      <div className="relative pt-[72px]">
        <div className="relative z-10 bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] pt-12 pb-56 text-center px-4 backdrop-blur-xl">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[40px] font-bold text-[#F59E0B] mb-3 tracking-wide">About Us</h1>
          <p className="text-white max-w-3xl mx-auto text-[12px] sm:text-[13px] leading-relaxed">
            Dedicated to providing integrated quality education, honing holistic development, and shaping future leaders through a legacy of heritage and excellence.
          </p>
        </div>
        <div className="absolute top-[200px] left-0 right-0 h-[600px] z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
          <div className="absolute inset-0 bg-[#0B1F3A]/80 mix-blend-multiply" />
        </div>

        {/* Legacy Card */}
        <div className="max-w-[1200px] mx-auto -mt-32 bg-white/90 backdrop-blur-sm p-8 sm:p-12 md:p-16 shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="pr-0 md:pr-4">
              <h2 className="text-[1.5rem] sm:text-[1.8rem] md:text-[28px] font-bold text-[#0B1F3A] mb-6 leading-tight">A Legacy of Heritage &<br />Excellence</h2>
              <div className="space-y-5 text-[12px] sm:text-[13px] text-gray-700 leading-relaxed">
                <p>
                  Cebu Eastern College's journey began in 1915 when it was founded as the Cebu Chinese School. Born from a vision to provide quality education that bridges cultures, it quickly became a cornerstone of learning in the community.
                </p>
                <p>
                  In 1938, a significant milestone was achieved through a strategic merger, strengthening the institution's foundation and expanding its reach. The commitment to educational excellence led to formal recognition by the government in 1950, solidifying its status as a premier educational provider.
                </p>
                <p>
                  Reflecting its broadened scope and progressive educational philosophy, the institution officially adopted the name Cebu Eastern College in 1962. Today, CEC continues to honor its rich heritage while embracing modern pedagogical advancements to prepare students for a globalized world.
                </p>
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1574950578143-858c6fc58922?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Historical Building" className="w-full rounded-md shadow-md filter sepia-[0.6] brightness-110 contrast-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />

      {/* Mission & Vision */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 px-4 sm:px-6">
          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 border-l-[3px] border-[#1E4E8C] shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gray-100/80 w-10 h-10 flex justify-center items-center rounded-md text-[#1E4E8C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A]">Our Mission</h3>
            </div>
            <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed pr-0 sm:pr-4">
              To provide integrated quality education enriched with Confucian teachings, fostering a nurturing environment that cultivates the intellectual, moral, and physical well-being of every student.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 border-l-[3px] border-[#1E4E8C] shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gray-100/80 w-10 h-10 flex justify-center items-center rounded-md text-[#1E4E8C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A]">Our Vision</h3>
            </div>
            <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed pr-0 sm:pr-4">
              To be a premier non-stock, non-profit educational institution dedicated to honing morally upright, competent, and socially responsible graduates who are equipped to thrive in a dynamic society.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto bg-white/90 backdrop-blur-sm p-8 sm:p-12 md:p-16 shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)]">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] mb-3">Core Values</h2>
            <p className="text-[12px] sm:text-[13px] text-gray-500">
              The guiding principles that shape our community and define the Cebu Eastern College experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { letter: 'V', title: 'Virtue', desc: 'Moral uprightness, discipline, and the embodiment of Confucian teachings in daily life.' },
              { letter: 'A', title: 'Academic Excellence', desc: 'Commitment to quality education and the continuous pursuit of 21st-century skills.' },
              { letter: 'L', title: 'Leadership', desc: 'Developing responsible, capable, and visionary leaders for tomorrow.' },
              { letter: 'U', title: 'Unity in Diversity', desc: 'Deep respect for all individuals and celebration of our rich Filipino-Chinese heritage.' },
              { letter: 'E', title: 'Empathy and Service', desc: 'Fostering compassion and active participation in meaningful community service.' },
              { letter: 'S', title: 'Success with Integrity', desc: 'Achieving goals through honesty, profound responsibility, and unwavering hard work.' },
            ].map((item) => (
              <div key={item.letter} className="border border-[rgba(11,31,58,0.08)] backdrop-blur-sm p-6 sm:p-8 flex gap-5 sm:gap-6 hover:shadow-sm transition-shadow shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
                <div className="text-[48px] sm:text-[64px] font-bold text-[#e2e8f0] leading-[0.8] font-sans shrink-0">{item.letter}</div>
                <div>
                  <h4 className="text-[15px] sm:text-[17px] font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
