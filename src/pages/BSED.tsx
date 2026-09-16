import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BSED() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] overflow-x-hidden">
      <Header />

      <main className="max-w-[1200px] mx-auto px-5 pt-10 pb-20">

        {/* Hero Section */}
        <section className="bg-white rounded-[20px] flex flex-col md:flex-row min-h-[450px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden mb-8">
          <div className="flex-1 bg-[#0B1F3A] px-8 py-12 md:px-12 flex flex-col justify-center text-white relative">
            <span className="inline-flex items-center gap-1.5 border border-[#F5B027]/30 bg-white/5 text-white px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase w-fit">
              <span className="text-[#F5B027]">🧭</span> COLLEGE OF TEACHER EDUCATION
            </span>
            <h1 className="text-[32px] md:text-[44px] leading-[1.1] my-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bachelor of Secondary Education
            </h1>
            <p className="text-[#94A3B8] text-sm md:text-base max-w-[90%] mb-10">
              Prepare for an impactful teaching career with rigorous pedagogical training, field study experiences, major specializations, and Eastern-Western ethical foundations.
            </p>
            <div className="flex flex-wrap gap-5 mt-auto">
              <span className="flex items-center gap-2 text-[12px] text-[#CBD5E1]">
                <span className="text-[#F5B027]">✓</span> CHED Aligned & Board Licensure (LET) Ready
              </span>
              <span className="flex items-center gap-2 text-[12px] text-[#CBD5E1]">
                <span className="text-[#F5B027]">🎓</span> Comprehensive Field Practicum
              </span>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px]">
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" alt="Future Teachers" className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute bottom-5 right-5 bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5">
              <span className="text-[#F5B027]">👥</span> Future Teachers Practicum & Mentorship
            </span>
          </div>
        </section>

        {/* Info Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {[
            { icon: '🛡️', color: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]', title: 'CHED Aligned', desc: 'PRC LET Ready Curriculum' },
            { icon: '📖', color: 'bg-[#FFF7ED]', text: 'text-[#F97316]', title: 'Major Specializations', desc: 'English, Math, Science & Filipino' },
            { icon: '🖥️', color: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', title: 'Field Practice', desc: 'Real Classroom Internship & Demo' },
            { icon: '🏆', color: 'bg-[#F5F3FF]', text: 'text-[#8B5CF6]', title: 'Since 1915', desc: 'Over 100 Years of Educational Excellence' },
          ].map((c) => (
            <div key={c.title} className="bg-white p-5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center gap-3.5 border border-[#F1F5F9]">
              <div className={`w-[50px] h-[50px] rounded-[10px] flex items-center justify-center text-xl shrink-0 ${c.color} ${c.text}`}>{c.icon}</div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#1E293B] mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{c.title}</h4>
                <p className="text-[11px] text-[#475569] leading-[1.3]">{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Curriculum Section */}
        <section className="mb-14">
          <div className="mb-8 max-w-[600px]">
            <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#F97316] mb-2">
              <span className="w-5 h-0.5 bg-[#F97316]" /> OUR CURRICULUM & MAJORS
            </span>
            <h2 className="text-[26px] md:text-[32px] leading-[1.2] my-2.5" style={{ fontFamily: "'Playfair Display', serif" }}>
              A Rigorous Curriculum for Future Educators
            </h2>
            <p className="text-[#475569] text-sm md:text-[15px]">
              Our Bachelor of Secondary Education (BSEd) program equips students with mastery in teaching methodology, curriculum design, educational technology, and specialized subject domains.
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-5 md:h-[400px]">

              {/* Demonstration Teaching Lab Image */}
              <div className="md:flex-[0_0_25%] relative rounded-[20px] overflow-hidden min-h-[200px] bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C]">
                <img src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80" alt="Demonstration Teaching Lab" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1.5">
                  <span className="text-[#F5B027]">🧑‍🏫</span> Demonstration Teaching Lab
                </span>
              </div>

              {/* Pedagogy Card */}
              <div className="md:flex-[0_0_32%] bg-[#0B1F3A] rounded-[20px] p-7 text-white flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#F5B027] mb-5">📖</div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-[#F5B027] mb-2">PEDAGOGY & METHODOLOGY</span>
                <h3 className="text-lg font-semibold mb-2.5 leading-[1.3]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Foundations of Education & Teaching Methods
                </h3>
                <p className="text-[13px] text-[#94A3B8] mb-4">
                  Master contemporary instructional designs, classroom management, learner assessment, and inclusive educational practices.
                </p>
                <ul className="mt-auto space-y-2">
                  {['Curriculum Development & Assessment', 'Educational Psychology & Learner Development', 'Micro-teaching & Classroom Simulations'].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]">
                      <span className="text-[#F5B027] mt-0.5">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specializations Card */}
              <div className="flex-1 bg-[#0B1F3A] rounded-[20px] overflow-hidden flex flex-col">
                <div className="p-7 text-white">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#F5B027] mb-5">🏅</div>
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-[#F5B027] mb-2">SPECIALIZATIONS & MAJORS</span>
                  <h3 className="text-xl font-semibold mb-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>Major Academic Specializations</h3>
                  <p className="text-[13px] text-[#94A3B8]">
                    Deep subject-matter expertise across in-demand disciplines including English, Mathematics, Sciences, and Social Studies.
                  </p>
                </div>
                <div className="flex-1 relative min-h-[160px]">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" alt="Specialization Seminars" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-3.5 left-3.5 bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px]">
                    Specialization Seminars & Workshops
                  </span>
                  <span className="absolute bottom-3.5 right-3.5 bg-[#F5B027] text-[#0B1F3A] px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5">
                    📝 Licensure Exam Preparation
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-5 md:h-[350px]">

              {/* EdTech Card */}
              <div className="flex-1 bg-[#0B1F3A] rounded-[20px] flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 p-7 text-white flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#F5B027] mb-2.5">💻</div>
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-[#F5B027] mb-2 mt-2.5">EDUCATIONAL TECHNOLOGY</span>
                  <h3 className="text-xl font-semibold mb-2.5 leading-[1.3]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    EdTech & Modern Learning Tools
                  </h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">
                    Harness innovative digital tools, blended learning strategies, and multimedia instructional materials for interactive instruction.
                  </p>
                  <ul className="mt-auto space-y-2">
                    <li className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]"><span className="text-[#F5B027] mt-0.5">✓</span> Digital Courseware Design & LMS Integration</li>
                    <li className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]"><span className="text-[#F5B027] mt-0.5">✓</span> Interactive Smart Classrooms & Pedagogy</li>
                  </ul>
                </div>
                <div className="md:flex-[0_0_40%] relative min-h-[180px]">
                  <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80" alt="EdTech & Learning Hub" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-3.5 right-3.5 bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1.5">
                    <span className="text-[#F5B027]">💻</span> EdTech & Learning Hub
                  </span>
                </div>
              </div>

              {/* Field Study Card */}
              <div className="flex-1 bg-[#0B1F3A] rounded-[20px] flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 p-7 text-white flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#F5B027] mb-2.5">🧑‍🏫</div>
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-[#F5B027] mb-2 mt-2.5">FIELD STUDY & PRACTICUM</span>
                  <h3 className="text-xl font-semibold mb-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>Real-World Practice Teaching</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">
                    Gain invaluable on-the-ground teaching experience through partner secondary schools, guided observation, and intensive student internship.
                  </p>
                  <ul className="mt-auto space-y-2">
                    <li className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]"><span className="text-[#F5B027] mt-0.5">✓</span> Pre-service Teaching Internship</li>
                    <li className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]"><span className="text-[#F5B027] mt-0.5">👥</span> Mentorship from Seasoned Educators</li>
                    <li className="flex items-start gap-2.5 text-[12px] text-[#94A3B8]"><span className="text-[#F5B027] mt-0.5">🤝</span> Community Literacy Outreach Programs</li>
                  </ul>
                </div>
                <div className="md:flex-[0_0_40%] relative min-h-[180px]">
                  <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80" alt="Pre-Service Teaching Internship" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-3.5 right-3.5 bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1.5">
                    <span className="text-[#F5B027]">🤝</span> Pre-Service Teaching Internship
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supportive Environment */}
        <section className="bg-white rounded-[20px] flex flex-col md:flex-row overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9] mb-10">
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-3 py-1.5 rounded-full text-[11px] font-semibold w-fit">
              🎓 COLLEGE OF EDUCATION
            </span>
            <h2 className="text-[24px] md:text-[30px] leading-[1.2] my-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              A Supportive Environment for Aspiring Teachers
            </h2>
            <p className="text-[#475569] text-sm md:text-[15px] mb-7">
              Experience an inspiring tertiary learning community equipped with dedicated lecture halls, mock classrooms, student teacher resource centers, and guidance counseling to prepare you for LET excellence.
            </p>
            <div className="flex flex-wrap gap-5">
              <span className="flex items-center gap-2 text-[13px] font-medium text-[#1E293B]">
                <span className="text-[#22C55E]">✓</span> LET Board Exam Preparation
              </span>
              <span className="flex items-center gap-2 text-[13px] font-medium text-[#1E293B]">
                <span className="text-[#3B82F6]">👥</span> Dedicated Faculty Mentors
              </span>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px]">
            <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80" alt="Cebu Eastern College Campus" className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute bottom-5 right-5 bg-[#0B1F3A]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5">
              <span className="text-[#F5B027]">🏛️</span> Cebu Eastern College Campus & Facilities
            </span>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#E2E8F0] pt-10 flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h3 className="text-xl md:text-[22px] font-bold text-[#1E293B] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ready to pursue your Bachelor of Secondary Education?
            </h3>
            <p className="text-[#475569] text-sm max-w-[600px]">
              College admissions and scholarship applications for incoming freshmen and transferees are now open. Start your journey as a transformative teacher today.
            </p>
          </div>
          <a href="/enrollment/college" className="bg-[#0B1F3A] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#1E293B] transition-colors shrink-0">
            Enroll Now!
          </a>
        </section>

      </main>

      <Footer />
    </div>
  )
}
