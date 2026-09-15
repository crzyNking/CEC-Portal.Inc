import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Kindergarten() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#E2E8F0] py-2.5 px-6">
        <div className="max-w-[1200px] mx-auto text-[12px] text-[#475569]">
          <a href="/" className="hover:text-[#0B1F3A]">Home</a> &gt;{' '}
          <a href="/programs" className="hover:text-[#0B1F3A]">Academic Programs</a> &gt;{' '}
          <span className="text-[#0F172A] font-semibold">Kindergarten</span>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Hero */}
        <section className="bg-[#071F43] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 text-white shadow-lg mb-8">
          <div className="p-10 md:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Kindergarten
              </span>
              <h1 className="text-[28px] md:text-[32px] font-bold leading-[1.25] mb-4">
                Nurturing Young Minds with Care and Creativity
              </h1>
              <p className="text-[#94A3B8] text-[14px] leading-[1.6] mb-10">
                A warm, stimulating environment where children develop foundational skills through play-based learning, Chinese immersion, and values formation.
              </p>
            </div>
            <div className="flex gap-5 text-[12px] text-[#CBD5E1]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Play-Based Learning
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                Chinese Immersion
              </span>
            </div>
          </div>
          <div className="relative bg-[#1E293B] min-h-[300px]">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" alt="Kindergarten" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[
            { icon: '🎨', value: 'Nursery 1', label: '3 Years Old' },
            { icon: '📚', value: 'Kinder 1', label: '4 Years Old' },
            { icon: '✏️', value: 'Kinder 2', label: '5 Years Old' },
            { icon: '🌐', value: '3 Languages', label: 'English, Filipino & Mandarin' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-lg shrink-0">{s.icon}</div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0F172A]">{s.value}</h3>
                <p className="text-[12px] text-[#475569]">{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Programs Offered */}
        <section className="mb-12">
          <div className="mb-8">
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#475569] flex items-center gap-2 mb-1.5">
              <span className="w-4 h-0.5 bg-[#475569]" /> Programs Offered
            </div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-1.5">Pre-Elementary Programs &amp; Chinese Immersion</h2>
            <p className="text-[14px] text-[#475569]">Comprehensive early childhood programs featuring integrated English &amp; Chinese classes with Free Chinese Textbook.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📖', title: 'Integrated Curriculum', desc: 'English and Chinese classes with free Chinese textbook for all students.' },
              { icon: '🎭', title: 'Cultural Activities', desc: 'Chinese cultural activities, celebrations, and language immersion programs.' },
              { icon: '🧩', title: 'Learning by Doing', desc: 'Holistic approach blending cultural heritage, modern technology, and values.' },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-lg mb-4">{c.icon}</div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">{c.title}</h3>
                <p className="text-[13px] text-[#475569] leading-[1.6]">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose CEC */}
        <section className="mb-12">
          <div className="mb-8">
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#475569] flex items-center gap-2 mb-1.5">
              <span className="w-4 h-0.5 bg-[#475569]" /> Why Choose CEC
            </div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-1.5">A Legacy of Educational Excellence</h2>
          </div>
          <div className="bg-[#071F43] rounded-2xl p-8 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[18px] font-bold mb-4">Kindergarten at CEC</h3>
              <ul className="space-y-3">
                {['Exemplary English & Chinese Faculty', 'Affordable Tuition Fees with Discounts', 'Grounded in Confucian Teachings', 'Safe & Nurturing Environment', 'Free Chinese Textbook'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-[#CBD5E1]">
                    <svg className="w-4 h-4 text-[#F59E0B] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl overflow-hidden min-h-[250px]">
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" alt="Kindergarten" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-8 md:px-10 flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h3 className="text-[20px] font-bold text-[#071F43] mb-1.5">Ready to enroll your child?</h3>
            <p className="text-[13px] text-[#475569]">Give your child the opportunity to learn, grow, and prepare for a brighter future at CEC.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="/enrollment/kindergarten" className="bg-[#071F43] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#0B1F3A] transition-colors">
              Enroll Now
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
