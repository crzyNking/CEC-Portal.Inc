import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Kindergarten() {
  return (
    <div className="min-h-screen bg-[#EEF1F6] text-[#1C1C1C] overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="bg-[#0B1F3A] grid grid-cols-1 md:grid-cols-2 items-center px-6 py-12 md:px-10 md:py-14 gap-6">
        <div className="max-w-[520px]">
          <span className="inline-block bg-[#D8CBA8] text-[#3B3220] text-[11px] font-bold tracking-wide px-3 py-1.5 rounded mb-4">
            BASIC EDUCATION &bull; S.Y. 2026-2027
          </span>
          <h1 className="text-white text-3xl md:text-[34px] leading-[1.25] mb-5">
            Nurturing Young Minds with Care and Creativity
          </h1>
          <p className="text-[#CBD5E1] text-sm leading-[1.6] mb-7">
            Cebu Eastern College's Kindergarten program provides a warm, stimulating environment where children develop foundational skills through play-based learning, cultural immersion, and values formation guided by Confucian principles.
          </p>
          <a href="/enrollment/kindergarten" className="inline-block bg-[#F6B93B] text-[#3B2F00] font-bold text-[13px] tracking-wide px-8 py-3.5 rounded-full hover:bg-[#E5A52E] transition-colors">
            ENROLL NOW!
          </a>
        </div>
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80" alt="Kindergarten Classroom" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </section>

      {/* Section Title */}
      <div className="text-center pt-12 pb-3 px-5">
        <h2 className="text-[#0B1F3A] text-[30px] mb-2.5">Kindergarten Programs</h2>
        <p className="text-[#6B7280] text-sm">Building Strong Foundations for Lifelong Learning</p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px] mx-auto px-6 md:px-10 pb-10 mt-8">

        {/* Card 1 - Programs Offered */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2">
          <div className="p-6">
            <div className="w-9 h-9 bg-[#EEF1F6] rounded-md flex items-center justify-center mb-4 text-base">
              📖
            </div>
            <h3 className="text-[#0B1F3A] text-lg mb-2.5 leading-[1.3]">Programs Offered &amp; Chinese Immersion</h3>
            <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
              Early childhood education featuring integrated English &amp; Chinese classes with Free Chinese Textbook.
            </p>
            <div className="text-[#C9A13B] text-[11px] font-bold tracking-wide mb-2">LEVELS OFFERED</div>
            <ul className="list-none text-[13px] text-[#1C1C1C]">
              <li className="py-1.5 border-t border-[#EEE]">● Nursery 1 (3 Years Old)</li>
              <li className="py-1.5 border-t border-[#EEE]">● Kinder 1 (4 Years Old)</li>
              <li className="py-1.5 border-t border-[#EEE]">● Kinder 2 (5 Years Old)</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?auto=format&fit=crop&w=400&q=80" alt="Classroom" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

        {/* Card 2 - Facilities */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="h-[180px]">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" alt="Play Area" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="p-6">
            <span className="inline-block bg-[#FDF0DA] text-[#B8860B] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded mb-2.5">
              EXCLUSIVE FACILITIES
            </span>
            <h3 className="text-[#0B1F3A] text-lg mb-2.5">Safe &amp; Fun Learning Spaces</h3>
            <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
              Colorful, child-friendly classrooms designed to inspire creativity and exploration in a safe environment.
            </p>
            <span className="text-[#0B1F3A] text-xs font-semibold block pt-2.5 border-t border-[#EEE]">
              Child-Safe Indoor Play Areas
            </span>
          </div>
        </div>

        {/* Card 3 - Why Choose CEC */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6">
          <div className="w-9 h-9 bg-[#EEF1F6] rounded-md flex items-center justify-center mb-4 text-base">
            🎓
          </div>
          <h3 className="text-[#0B1F3A] text-lg mb-2.5">Why Choose CEC for Kindergarten?</h3>
          <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
            A nurturing environment that fosters early growth, creativity, and basic skills for young learners.
          </p>
          <div className="text-[#C9A13B] text-[11px] font-bold tracking-wide mb-2">KEY HIGHLIGHTS</div>
          <ul className="list-none text-[13px] text-[#1C1C1C]">
            <li className="py-1.5 border-t border-[#EEE]">● Caring &amp; Qualified Teachers</li>
            <li className="py-1.5 border-t border-[#EEE]">● Play-Based Learning Approach</li>
            <li className="py-1.5 border-t border-[#EEE]">● Affordable Tuition with Chinese Immersion</li>
          </ul>
        </div>

        {/* Card 4 - Legacy (dark) */}
        <div className="bg-[#0B1F3A] rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 text-white">
            <span className="inline-block bg-[#D8CBA8] text-[#3B3220] text-[10px] font-bold tracking-wide px-3 py-1.5 rounded mb-3.5">
              CECSINCE1915 &bull; 109 YEARS
            </span>
            <h3 className="text-lg mb-2.5 text-white">A Legacy of Educational Excellence</h3>
            <p className="text-[#CBD5E1] text-[13px] leading-[1.6] mb-3">
              Over a century of commitment to quality Filipino-Chinese education in Cebu City.
            </p>
            <div className="bg-[#122A63] rounded-md p-3 flex items-center gap-2.5 text-[11px] text-[#E5E9F0] mt-2.5">
              <span>🛡️</span>
              <span>Centennial institution fostering character, wisdom, and leadership</span>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" alt="Classroom" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
