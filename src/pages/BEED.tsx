import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BEED() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#333333] overflow-x-hidden">
      <Header />

      <div className="max-w-[1200px] mx-auto px-5">

        {/* Hero Section */}
        <section className="bg-[#0A183D] rounded-2xl flex flex-col md:flex-row overflow-hidden text-white mt-7 mb-8 min-h-[380px]">
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 border border-white/30 bg-white/10 px-3 py-1 rounded-full text-[10px] font-semibold w-fit mb-5">
              <span>✓</span> BEED
            </span>
            <h1 className="text-[30px] md:text-[40px] leading-[1.2] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bachelor of Elementary Education
            </h1>
            <p className="text-sm text-[#CBD5E0] max-w-[450px] mb-10 leading-[1.6]">
              Developing competent, compassionate, and innovative future teachers who will shape the next generation of learners. BEED prepares you to become a professional educator equipped with knowledge, skills, and values for quality elementary education.
            </p>
            <div className="flex flex-wrap gap-5 text-[11px] text-[#A0AEC0]">
              <span className="flex items-center gap-2"><span className="text-[#F6AD55]">✓</span> DepEd Recognized</span>
              <span className="flex items-center gap-2"><span className="text-[#F6AD55]">📖</span> TESDA/CHED Compliant</span>
            </div>
          </div>
          <div className="md:flex-[1.2] relative bg-[#2D3748] md:border-l-2 md:border-dashed md:border-[#4A5568] min-h-[240px]">
            <img src="https://iili.io/nnFNCjn.png" alt="Nutrition Month Event" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[
            { icon: '🏆', value: '100%', label: 'DepEd Aligned' },
            { icon: '🌐', value: '3 Languages', label: 'English, Filipino & Mandarin' },
            { icon: '🔬', value: 'Hands-on Practice', label: 'Field Study & Teaching Internship' },
            { icon: '🏅', value: 'Since 1915', label: 'Over 100 Years of Education' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center gap-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#6B7280] text-base shrink-0">{s.icon}</div>
              <div>
                <h4 className="text-[15px] font-bold text-[#333333] mb-0.5">{s.value}</h4>
                <p className="text-[11px] text-[#6B7280]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Curriculum Header */}
        <div className="mb-8">
          <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2.5 mb-2.5 text-[#333333]">
            <span className="w-[30px] h-0.5 bg-[#333333]" /> OUR CURRICULUM
          </div>
          <h3 className="text-[24px] md:text-[28px] mb-2.5 text-[#333333]" style={{ fontFamily: "'Playfair Display', serif" }}>
            A Strong Foundation for Future Teacher
          </h3>
          <p className="text-[13px] text-[#6B7280]">BEED offers a well-rounded curriculum that combines professional education, general education and specialized subjects to prepare you for the real classroom</p>
        </div>

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {[
            {
              icon: '👩‍🏫', label: 'PROFESSIONAL EDUCATION', title: 'Teaching Strategies and Methods',
              desc: 'Learn effective teaching strategies, classroom management, and child development to create meaningful learning experiences.',
              items: ['Child and Adolescent Development', 'Curriculum and Instruction', 'Classroom Management'],
              img: 'https://iili.io/nnFNxCG.png', alt: 'Classroom Teaching',
            },
            {
              icon: '💬', label: 'LANGUAGE & COMMUNICATION', title: 'English and Filipino Literature',
              desc: 'Strengthen your communication skills in both English and Filipino, and learn how to use language effectively in teaching and in life.',
              items: ['Reading and Writing', 'Literature', 'Communication Skills'],
              img: 'https://iili.io/nnFNzGf.png', alt: 'Students Reading',
            },
            {
              icon: '👥', label: 'FIELD EXPERIENCE', title: 'Teaching Practicum and Internship',
              desc: 'Gain real classroom experience through supervised teaching, observation, and community immersion',
              items: ['Observation', 'Demonstration Teaching', 'Student Teaching'],
              img: 'https://iili.io/nnFNI44.png', alt: 'Classroom Observation',
            },
            {
              icon: '❤️', label: 'VALUES AND CHARACTERS', title: 'Professionalism and Social Responsibility',
              desc: 'Build your values, leadership skills, and commitment to serve the community through education.',
              items: ['Christian Living', 'Ethics and Values', 'Community Engagement'],
              img: 'https://iili.io/nnFNAa2.png', alt: 'School Assembly',
            },
          ].map((c) => (
            <div key={c.title} className="bg-[#0F2356] rounded-2xl flex flex-col md:flex-row overflow-hidden text-white min-h-[300px]">
              <div className="md:flex-[1.1] p-8 flex flex-col">
                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mb-5">{c.icon}</div>
                <div className="text-[9px] font-bold text-[#F6AD55] uppercase tracking-widest mb-2.5">{c.label}</div>
                <h4 className="text-xl leading-[1.3] mb-3.5" style={{ fontFamily: "'Playfair Display', serif" }}>{c.title}</h4>
                <p className="text-[11px] text-[#CBD5E0] leading-[1.6] mb-5">{c.desc}</p>
                <ul className="flex flex-col gap-2.5 mt-auto">
                  {c.items.map((item) => (
                    <li key={item} className="text-[11px] text-[#A0AEC0] flex items-center gap-2">
                      <span className="text-[#F6AD55] text-[10px]">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:flex-[0.9] bg-[#2D3748] md:border-l md:border-dashed md:border-white/20 min-h-[180px]">
                <img src={c.img} alt={c.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>

        {/* Career Banner */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col md:flex-row overflow-hidden mb-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 border border-[#E2E8F0] bg-[#F8FAFC] text-[#6B7280] px-3 py-1 rounded-full text-[10px] font-semibold w-fit mb-4">
              <span>✓</span> BEED
            </span>
            <h3 className="text-[26px] md:text-[32px] text-[#333333] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>A Career of Purpose</h3>
            <p className="text-[13px] text-[#6B7280] max-w-[400px] mb-7 leading-[1.6]">
              Be a teacher. Make a difference. The BEED program at Cebu Eastern College prepares you to inspire, empower, and build a brighter future for every child.
            </p>
            <div className="flex flex-wrap gap-5 text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-2"><span className="text-[#333333]">✓</span> DepEd Recognized</span>
              <span className="flex items-center gap-2"><span className="text-[#333333]">📖</span> Field-Based Learning</span>
            </div>
          </div>
          <div className="md:flex-1 bg-[#E2E8F0] md:border-l-2 md:border-dashed md:border-[#CBD5E0] min-h-[220px]">
            <img src="https://iili.io/nnFNRvS.png" alt="Cebu Eastern College Building" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* CTA Bar */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-5 mb-10">
          <div>
            <h4 className="text-base text-[#333333] mb-1">Join the BEED Program at Cebu Eastern College!</h4>
            <p className="text-[12px] text-[#6B7280]">Be part of a community that believes in quality education and lifelong learning.</p>
          </div>
          <a href="/enrollment/college" className="bg-[#0B1C48] text-white px-6 py-2.5 rounded-md text-[13px] font-semibold hover:bg-[#0A183D] transition-colors shrink-0">
            Enroll Now!
          </a>
        </div>

      </div>

      <Footer />
    </div>
  )
}
