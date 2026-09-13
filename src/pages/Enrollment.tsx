import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

interface Program {
  id: string
  title: string
  slug: string
  description: string
  category: string
  is_active: boolean
}

interface EnrollmentSettings {
  is_open: boolean
  academic_year: string
  announcement: string
  instructions: string
  requirements: string
}

const defaultK12 = [
  { title: 'Kindergarten', description: 'Ages 3-5 • Foundational learning through play-based curriculum', path: '/enrollment/kindergarten', img: 'https://scontent.fceb6-1.fna.fbcdn.net/v/t1.15752-9/788689037_1455447903084514_7381586454221175542_n.jpg?stp=dst-jpg_tt6&cstp=mx864x1236&ctp=s864x1236&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFdViM662zFYjm5PjuWzWfc6LENnQr6XjbosQ2dCvpeNgqXP6488TFcyVpZA-BaCJqCjIxZkFVPO3YB90mo1rAa&_nc_ohc=2u8pGS0Xpz4Q7kNvwFown25&_nc_oc=Adqgw0fuDDqzQ-p9kE0QwXSb4LCA-8VGlfd1V-tLSBhsjgitAes1zEVCZrFMsMdu6io&_nc_zt=23&_nc_ht=scontent.fceb6-1.fna&_nc_ss=7b2a8&oh=03_Q7cD6QGZCNaRoDfP-HLc-xnFjLS5Y8YDloXl2XZRqMLVE3-D-g&oe=6ACE3D42' },
  { title: 'Elementary', description: 'Grades 1-6 • Building strong academic foundations', path: '/enrollment/elementary', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80' },
  { title: 'Junior High', description: 'Grades 7-10 • Comprehensive secondary education', path: '/enrollment/junior-high', img: 'https://scontent.fceb6-4.fna.fbcdn.net/v/t1.15752-9/789580025_1069022505495421_4084908666977232936_n.jpg?stp=dst-jpg_tt6&cstp=mx864x1222&ctp=s864x1222&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFGm3ry_xgh91Fns0SIWYfI5GI0lmGnXvfkYjSWYade96_v-jWtWObEyGS_exA6x2nM6YY-pjhwWEEDK-6NLc3W&_nc_ohc=lhLOgRlVNQ4Q7kNvwELbWrC&_nc_oc=AdomgskGqRUjkht2rC8aom-ejjHaXnFGntfoOvFruCUbCGaANnqJGVI42VSCQZxykv4&_nc_zt=23&_nc_ht=scontent.fceb6-4.fna&_nc_ss=7b2a8&oh=03_Q7cD6QHRcFHSo-IHWl1OVgA2cs6DqbD-H5kbAgHvdVz1ezcnQQ&oe=6ACE307F' },
  { title: 'Senior High', description: 'Grades 11-12 • Specialized tracks and strands', path: '/enrollment/senior-high', img: 'https://scontent.fceb6-1.fna.fbcdn.net/v/t1.15752-9/784424814_2154589371937860_1313611218039530401_n.jpg?stp=dst-jpg_tt6&cstp=mx864x1222&ctp=s864x1222&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGxr_es-xiyPJ_j2G3RWw8WRE40jjPwUepETjSOM_BR6rbOs8Gr_D0lRf-FBtVrtYazHCmng0dA1fCAExuEl-AH&_nc_ohc=1uI3xYpWA00Q7kNvwFOv_v2&_nc_oc=AdqAjA4firQxIS3GWvP29284WF-tFn2yzJ6OfC1E_-XKwbTRK3r3UwALH0OuudBrcpw&_nc_zt=23&_nc_ht=scontent.fceb6-1.fna&_nc_ss=7b2a8&oh=03_Q7cD6QHQkl2NPGQ5uACPiiGg4xFsRlMNeNKKnjlOx0Ccl7YNjA&oe=6ACE2C35' },
]

export default function Enrollment() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [enrollment, setEnrollment] = useState<EnrollmentSettings | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [programsRes, enrollmentRes] = await Promise.all([
        supabase.from('programs').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('enrollment_settings').select('*').limit(1).single()
      ])
      setPrograms(programsRes.data || [])
      setEnrollment(enrollmentRes.data)
    }
    fetchData()
  }, [])

  const collegePrograms = programs.filter(p => p.category === 'college').map(p => p.title)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0b1f40] to-[#111d45] text-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#002366] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#0047ab] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[1100px] mx-auto px-4 md:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
            <span className="text-xs font-medium">
              {enrollment?.is_open ? 'Enroll Now' : 'Enrollment Closed'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {enrollment?.announcement || 'Start Your Journey at CEC'}
          </h1>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl mx-auto">
            {enrollment?.academic_year ? `Academic Year ${enrollment.academic_year}` : 'Choose the program that fits your educational goals.'}
          </p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 md:px-10 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002366] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#0a1628]">K-12 Programs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultK12.map((level) => (
                <Link
                  key={level.title}
                  to={level.path}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#002366]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-[140px] overflow-hidden">
                    <img src={level.img} alt={level.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 text-base font-bold text-white">{level.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 leading-relaxed">{level.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#002366] group-hover:text-[#1d4ed8]">
                      Enroll Now
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002366] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#0a1628]">College</h2>
            </div>
            <Link
              to="/enrollment/college"
              className="group block bg-gradient-to-br from-[#0b1f40] to-[#002366] text-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-[140px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" alt="College" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f40] via-[#0b1f40]/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-base font-bold">Enroll in College</h3>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5">
                {(collegePrograms.length > 0 ? collegePrograms : [
                  'Bachelor of Elementary Education',
                  'Bachelor of Secondary Education',
                  'Bachelor of Science in Business Administration',
                  'Bachelor of Science in Accountancy',
                  'Bachelor of Science in Computer Science',
                  'Bachelor of Science in Information Technology',
                ]).map((prog) => (
                  <li key={prog} className="text-[11px] text-blue-200 flex items-start gap-2">
                    <span className="w-1 h-1 bg-white rounded-full mt-1.5 shrink-0" />
                    {prog}
                  </li>
                ))}
              </ul>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
