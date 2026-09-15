import Header from '../components/Header'
import Footer from '../components/Footer'

export default function JuniorHigh() {
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
            Dynamic Programs for Critical Thinkers and Leaders
          </h1>
          <p className="text-[#CBD5E1] text-sm leading-[1.6] mb-7">
            Cebu Eastern College's Junior High School program strengthens critical thinking, character, and personal development through a comprehensive curriculum that prepares students for senior high school and beyond.
          </p>
          <a href="/enrollment/junior-high" className="inline-block bg-[#F6B93B] text-[#3B2F00] font-bold text-[13px] tracking-wide px-8 py-3.5 rounded-full hover:bg-[#E5A52E] transition-colors">
            ENROLL NOW!
          </a>
        </div>
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80" alt="Junior High Students" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </section>

      {/* Section Title */}
      <div className="text-center pt-12 pb-3 px-5">
        <h2 className="text-[#0B1F3A] text-[30px] mb-2.5">Junior High Programs</h2>
        <p className="text-[#6B7280] text-sm">Strengthening Character and Academic Excellence</p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px] mx-auto px-6 md:px-10 pb-10 mt-8">

        {/* Card 1 - Curriculum */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2">
          <div className="p-6">
            <div className="w-9 h-9 bg-[#EEF1F6] rounded-md flex items-center justify-center mb-4 text-base">
              📚
            </div>
            <h3 className="text-[#0B1F3A] text-lg mb-2.5 leading-[1.3]">Comprehensive Curriculum</h3>
            <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
              A well-rounded academic program featuring core subjects, Chinese language instruction, and values education.
            </p>
            <div className="text-[#C9A13B] text-[11px] font-bold tracking-wide mb-2">CORE SUBJECTS</div>
            <ul className="list-none text-[13px] text-[#1C1C1C]">
              <li className="py-1.5 border-t border-[#EEE]">● English &amp; Filipino</li>
              <li className="py-1.5 border-t border-[#EEE]">● Mathematics &amp; Science</li>
              <li className="py-1.5 border-t border-[#EEE]">● Chinese Language &amp; Culture</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" alt="Classroom" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

        {/* Card 2 - Activities */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="h-[180px]">
            <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80" alt="Activities" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="p-6">
            <span className="inline-block bg-[#FDF0DA] text-[#B8860B] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded mb-2.5">
              EXTRACURRICULAR
            </span>
            <h3 className="text-[#0B1F3A] text-lg mb-2.5">Clubs &amp; Activities</h3>
            <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
              Diverse extracurricular programs that develop leadership, teamwork, and special talents outside the classroom.
            </p>
            <span className="text-[#0B1F3A] text-xs font-semibold block pt-2.5 border-t border-[#EEE]">
              Sports, Arts, Science Clubs &amp; More
            </span>
          </div>
        </div>

        {/* Card 3 - Why Choose CEC */}
        <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6">
          <div className="w-9 h-9 bg-[#EEF1F6] rounded-md flex items-center justify-center mb-4 text-base">
            🎓
          </div>
          <h3 className="text-[#0B1F3A] text-lg mb-2.5">Why Choose CEC for Junior High?</h3>
          <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-4">
            Dynamic programs designed to strengthen critical thinking, character, and personal development.
          </p>
          <div className="text-[#C9A13B] text-[11px] font-bold tracking-wide mb-2">KEY HIGHLIGHTS</div>
          <ul className="list-none text-[13px] text-[#1C1C1C]">
            <li className="py-1.5 border-t border-[#EEE]">● Dedicated Faculty &amp; Staff</li>
            <li className="py-1.5 border-t border-[#EEE]">● Values-Driven Education</li>
            <li className="py-1.5 border-t border-[#EEE]">● Affordable Quality Education</li>
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
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80" alt="Classroom" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
