import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const levels = [
  { title: 'Kindergarten', path: '/enrollment/kindergarten', desc: 'For children aged 5 and below starting their education journey.', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Elementary', path: '/enrollment/elementary', desc: 'Grades 1 to 6 — building strong foundational knowledge.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Junior High School', path: '/enrollment/junior-high', desc: 'Grades 7 to 10 — developing critical thinking and skills.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Senior High School', path: '/enrollment/senior-high', desc: 'Grades 11 to 12 — specialized strands for your future career.', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { title: 'College', path: '/enrollment/college', desc: 'Bachelor degree programs across multiple disciplines.', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A60.445 60.445 0 0012 21.75c2.676 0 5.216-.584 7.499-1.632M4.26 10.147a60.462 60.462 0 0114.499 0M17.115 10.149a30.037 30.037 0 00-.575 5.615c0 1.68-.578 3.226-1.547 4.45' },
]

export default function Enroll() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <section className="bg-gradient-to-r from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] backdrop-blur-xl text-white pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Enrollment</h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl">
            Choose your level to begin. After submitting the enrollment form, you'll receive a
            <span className="text-white font-semibold"> 6-digit Student ID Number</span> — use it to sign up and log in to the portal.
          </p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {levels.map((lv) => (
            <Link
              key={lv.path}
              to={lv.path}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.08)] p-6 hover:shadow-[0_12px_40px_rgba(11,31,58,0.15)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-11 h-11 bg-[#1E4E8C] rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-[#0B1F3A] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={lv.icon} />
                </svg>
              </div>
              <h2 className="text-base font-bold text-[#0B1F3A] mb-1.5">{lv.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{lv.desc}</p>
              <span className="text-[#1E4E8C] text-sm font-semibold group-hover:text-[#0B1F3A]">Enroll Now →</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.08)] p-6 md:p-8">
          <h2 className="text-base font-bold text-[#0B1F3A] mb-3">Already enrolled?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use the 6-digit Student ID Number you received after enrollment to create your portal account, or log in with your ID Number and password.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="inline-block bg-[#1E4E8C] hover:bg-[#0B1F3A] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-200 text-center">
              Sign Up
            </Link>
            <Link to="/login" className="inline-block bg-gray-100 hover:bg-gray-200 text-[#0B1F3A] font-semibold py-2.5 px-6 rounded-xl text-sm transition text-center">
              Log In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
