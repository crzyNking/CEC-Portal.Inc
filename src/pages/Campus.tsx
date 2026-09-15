import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const placeholder = 'https://placehold.co/600x400/38a0f4/ffffff?text=CEBU+EASTERN+COLLEGE'

const zones = [
  {
    img: placeholder,
    tag: 'ZONE 01',
    title: 'Administration Building & Main Gate',
    desc: 'The central hub for institutional leadership and secure campus access. Designed for operational clarity and efficient student services.',
  },
  {
    img: placeholder,
    tag: 'ZONE 02',
    title: 'High School Building',
    desc: 'Multi-story academic blocks featuring dedicated instructional spaces optimized for focused secondary education and pre-collegiate preparation.',
  },
  {
    img: placeholder,
    tag: 'ZONE 03',
    title: 'College Department',
    sub: 'BSIT, BSBA, BEEd, BSEd',
    desc: 'Higher education faculties housing degree programs in Information Technology, Business Administration, and Education within a rigorous academic framework.',
  },
  {
    img: placeholder,
    tag: 'ZONE 04',
    title: 'Elementary & Kindergarten',
    desc: 'Foundational learning sectors designed with structural safety and clarity in mind, providing a highly organized environment for early childhood development.',
  },
  {
    img: placeholder,
    tag: 'ZONE 05',
    title: 'Computer Laboratories',
    desc: 'Dedicated tech and IT learning spaces equipped with modern computers and software, designed to support students in developing digital literacy, programming skills, and technical training.',
  },
  {
    img: placeholder,
    tag: 'ZONE 06',
    title: 'Sports & Recreation',
    sub: 'Covered Court',
    desc: 'is a dynamic facility designed for strength training, athletic conditioning, and fitness, providing the space and equipment needed to support an active lifestyle.',
  },
]

const campusLabels: Record<string, string> = {
  main: 'Main Campus',
}

export default function Campus() {
  const { campusId } = useParams<{ campusId: string }>()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  if (!campusId || !campusLabels[campusId]) {
    return (
      <div className="min-h-screen bg-[#0B1F3A]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Campus Not Found</h2>
            <button onClick={() => navigate('/')} className="text-blue-300 underline">Return Home</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const heroLabel = campusLabels[campusId]

  return (
    <div className="min-h-screen bg-[#06295E]">
      <Header />
      <div className="max-w-[1040px] mx-auto px-5 py-10 pb-20">
        <div className="bg-white p-10 max-md:p-7 max-sm:p-5">

          {/* Hero Section */}
          <section>
            <span className="inline-block bg-[#C4CCE8] text-[#2C2E68] text-[11px] font-bold tracking-[0.06em] px-3.5 py-1.5 rounded mb-5">
              CAMPUS OVERVIEW
            </span>
            <h1 className="text-[38px] max-sm:text-[28px] leading-[1.15] font-extrabold text-[#0B1F3A] mb-4">
              {heroLabel} Showcase
            </h1>
            <p className="max-w-[640px] text-[#5D5D6C] text-[15px] leading-relaxed mb-8">
              A hyper-light, precision-engineered environment designed for scholarly pursuit. Explore the structural clarity and specialized zones that define Cebu Eastern College's downtown hub.
            </p>
            <hr className="border-none border-t border-[#E6E6EC] mb-0" />
            <div className="relative mx-[-44px] max-sm:mx-[-22px] overflow-hidden mt-8">
              <img src={placeholder} alt={`${heroLabel} building`} className="w-full block" />
              <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent text-white text-sm font-semibold px-6 py-10 pb-4">
                {heroLabel}
              </div>
            </div>
          </section>

          <div className="h-7" />

          {/* Location Section */}
          <section>
            <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-6 items-center">
              <div>
                <h2 className="flex items-center gap-2 text-[22px] font-extrabold text-[#0B1F3A] mb-5">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z" stroke="#0B1F3A" strokeWidth="1.8"/>
                    <circle cx="12" cy="9" r="2.4" stroke="#0B1F3A" strokeWidth="1.8"/>
                  </svg>
                  Location
                </h2>
                <p className="text-[17px] font-bold text-[#0B1F3A] mb-2">40 Leon Kilat Street</p>
                <p className="text-[14px] text-[#5D5D6C]">Pahina Central, downtown Cebu City</p>
              </div>
              <div className="border border-[#E6E6EC]">
                <div className="w-full h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[#5D5D6C] text-sm">
                  Map — Leon Kilat Street, Cebu City
                </div>
              </div>
            </div>
          </section>

          <div className="h-7" />

          {/* Zones Section */}
          <section>
            <h2 className="text-[26px] font-extrabold text-[#0B1F3A] mb-6">
              Academic & Structural Zones
            </h2>
            <hr className="border-none border-t border-[#E6E6EC] mb-0" />

            {zones.map((zone, i) => {
              const isReverse = i % 2 === 1
              return (
                <div key={zone.tag}>
                  <div
                    className={`grid gap-[40px] max-md:gap-[30px] items-center py-11 max-md:py-7 ${
                      isReverse
                        ? 'grid-cols-[1.1fr_0.9fr] max-md:grid-cols-1'
                        : 'grid-cols-[1.1fr_0.9fr] max-md:grid-cols-1'
                    }`}
                    style={{ borderBottom: i < zones.length - 1 ? '1px solid #E6E6EC' : undefined }}
                  >
                    {/* Photo */}
                    <div
                      className={`border border-[#E6E6EC] overflow-hidden ${
                        isReverse ? 'max-md:order-1 md:order-2' : ''
                      }`}
                    >
                      {!loaded[i] && (
                        <div className="w-full aspect-[3/2] bg-gray-100" />
                      )}
                      <img
                        src={zone.img}
                        alt={zone.title}
                        className={`w-full block aspect-[3/2] object-cover ${!loaded[i] ? 'absolute' : ''}`}
                        onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
                      />
                    </div>
                    {/* Text */}
                    <div
                      className={`text-left ${
                        isReverse
                          ? 'max-md:order-2 max-md:text-left md:order-1 md:text-right'
                          : ''
                      }`}
                    >
                      <span className="inline-block border border-[#D4D4DC] text-[#0B1F3A] text-[11px] font-bold tracking-[0.05em] px-2.5 py-1 mb-3.5">
                        {zone.tag}
                      </span>
                      <h3 className="text-[22px] max-sm:text-[19px] font-extrabold text-[#0B1F3A] mb-2.5">{zone.title}</h3>
                      {zone.sub && (
                        <p className="text-[14px] font-bold text-[#5D5D6C] mb-1.5">{zone.sub}</p>
                      )}
                      <p className={`text-[14px] leading-[1.6] text-[#666666] ${isReverse ? 'max-md:mr-0 md:ml-auto' : ''}`}>
                        {zone.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
