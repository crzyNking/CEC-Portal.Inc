import Header from '../components/Header'
import Footer from '../components/Footer'

const sections = [
  {
    num: '1',
    title: 'Data Collection and Usage',
    content: (
      <>
        <p>Cebu Eastern College collects various types of information to provide educational services effectively:</p>
        <ul>
          <li><strong>Contact Information:</strong> Names, addresses, email addresses, and phone numbers.</li>
          <li><strong>Student Records:</strong> Academic history, grades, attendance, and disciplinary records.</li>
          <li><strong>Parent/Guardian Information:</strong> Contact details and employment information where necessary.</li>
        </ul>
        <p>This data is primarily used for educational services, admission processing, communication, and fulfilling legal obligations.</p>
      </>
    ),
  },
  {
    num: '2',
    title: 'Data Security',
    content: (
      <p>We implement robust organizational, physical, and technical measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes secure data storage systems, restricted access protocols, and regular security audits.</p>
    ),
  },
  {
    num: '3',
    title: 'Data Sharing and Disclosure',
    content: (
      <p>Personal data may be shared internally among authorized personnel for legitimate educational and administrative purposes. We do not disclose personal information to external third parties without explicit consent, except when required by law or to authorized service providers under strict confidentiality agreements.</p>
    ),
  },
  {
    num: '4',
    title: 'Data Retention',
    content: (
      <p>We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by statutory retention periods. Once the retention period expires, data is securely disposed of or anonymized.</p>
    ),
  },
  {
    num: '5',
    title: 'Individual Rights',
    content: (
      <>
        <p>Under applicable laws, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> View the personal data CEC holds about you.</li>
          <li><strong>Correct:</strong> Request updates to inaccurate or incomplete information.</li>
          <li><strong>Inquire:</strong> Learn how your personal data is processed.</li>
          <li><strong>Raise Concerns:</strong> Report issues regarding data handling.</li>
        </ul>
      </>
    ),
  },
  {
    num: '6',
    title: 'Consent',
    content: (
      <>
        <p>When consent is required for the collection or processing of personal information, Cebu Eastern College will seek consent in an appropriate and transparent manner.</p>
        <p>Individuals may withdraw their consent when applicable, subject to legal, contractual, academic, or institutional requirements that may affect the availability of certain services.</p>
      </>
    ),
  },
  {
    num: '7',
    title: 'Data Transfer',
    content: (
      <p>When personal information needs to be shared or transferred to authorized parties, Cebu Eastern College will take reasonable measures to ensure that appropriate safeguards are in place and that the transfer complies with applicable data privacy laws and regulations.</p>
    ),
  },
  {
    num: '8',
    title: 'Privacy Awareness & Compliance',
    content: (
      <p>Cebu Eastern College promotes responsible data handling among its faculty, staff, and members of the school community. The institution supports awareness of data privacy responsibilities and works to maintain compliance with relevant privacy laws, policies, and regulations.</p>
    ),
  },
  {
    num: '9',
    title: 'Policy Updates',
    content: (
      <>
        <p>This Data Privacy Policy may be reviewed and updated from time to time to reflect changes in institutional practices, legal requirements, and data protection standards.</p>
        <p>Any significant updates may be communicated through appropriate Cebu Eastern College channels.</p>
      </>
    ),
  },
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1E4E8C]">
      <Header />

      {/* Hero */}
      <section className="py-[70px] px-5 text-center bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] backdrop-blur-xl">
        <div className="max-w-[640px] mx-auto">
          <h1
            className="mb-[18px]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#F59E0B',
              fontSize: 'clamp(32px, 5vw, 46px)',
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-[15px] leading-[1.6] max-w-[640px] mx-auto" style={{ color: '#dfe4f5' }}>
            We are committed to safeguarding the personal data of our students, parents, staff, alumni, and applicants through responsible collection, storage, and protection practices.
          </p>
        </div>
      </section>

      {/* Content */}
      <div
        className="flex justify-center pb-[60px] bg-gradient-to-b from-[#0B1F3A] via-[#102A43] to-[#1E4E8C]"
      >
        <div
          className="w-[92%] max-w-[640px] mt-[-20px] relative z-[2] rounded-[6px] px-[40px] py-[44px] max-sm:px-5 max-sm:py-8 bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)]"
        >
          {sections.map((section, i) => (
            <div key={section.num}>
              <div className="py-[22px]">
                <div className="flex items-center gap-[14px] mb-[10px]">
                  <div
                    className="w-[26px] h-[26px] min-w-[26px] rounded-full flex items-center justify-center text-[13px] font-bold"
                    style={{ background: '#dbe4fb', color: '#0B1F3A' }}
                  >
                    {section.num}
                  </div>
                  <h2 className="text-[19px] font-bold" style={{ color: '#0B1F3A' }}>
                    {section.title}
                  </h2>
                </div>
                <div className="ml-[40px] max-sm:ml-0 text-[14px] leading-[1.7]" style={{ color: '#4a5568' }}>
                  {section.content}
                </div>
              </div>
              {i < sections.length - 1 && (
                <hr className="border-none h-px" style={{ background: '#e2e6f0' }} />
              )}
            </div>
          ))}

          {/* Contact Box */}
          <div
            className="rounded-[6px] px-6 py-[22px] mt-[6px]"
            style={{ background: '#eef1fb' }}
          >
            <h3 className="text-[17px] font-bold mb-2" style={{ color: '#0B1F3A' }}>
              Contact Our Data Privacy Officer
            </h3>
            <p className="text-[13.5px] leading-[1.6] mb-[14px]" style={{ color: '#4a5568' }}>
              If you have any questions, concerns, or requests regarding your data privacy rights, please contact us:
            </p>
            <div className="flex gap-[34px] flex-wrap max-sm:flex-col max-sm:gap-[10px]">
              <a
                href="mailto:cebueasterncollege1915@yahoo.com"
                className="flex items-center gap-2 text-[13.5px] no-underline"
                style={{ color: '#0B1F3A' }}
              >
                <span>✉️</span>
                cebueasterncollege1915@yahoo.com
              </a>
              <a
                href="tel:+63322562523"
                className="flex items-center gap-2 text-[13.5px] no-underline"
                style={{ color: '#0B1F3A' }}
              >
                <span>📞</span>
                (032) 256 2523
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
