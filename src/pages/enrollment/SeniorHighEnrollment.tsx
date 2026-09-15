import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export default function SeniorHighEnrollment() {
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', age: '', dob: '', gender: '', strand: '',
    parentName: '', parentContact: '', parentEmail: '', parentOccupation: '',
    address: '', emergencyContact: '', emergencyPhone: '',
    requirements: { birthCert: false, Form137: false, goodMoral: false, medicalCert: false, idPhotos: false, previousDiploma: false },
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, requirements: { ...formData.requirements, [e.target.name]: e.target.checked } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('enrollment_submissions').insert({
      level: 'senior-high',
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      age: formData.age,
      dob: formData.dob,
      gender: formData.gender,
      grade_level: formData.strand,
      parent_name: formData.parentName,
      parent_contact: formData.parentContact,
      parent_email: formData.parentEmail,
      parent_occupation: formData.parentOccupation,
      address: formData.address,
      emergency_contact: formData.emergencyContact,
      emergency_phone: formData.emergencyPhone,
      requirements: formData.requirements,
    })

    if (insertError) {
      setError('Submission failed. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  const strands = [
    'STEM (Science, Technology, Engineering, and Mathematics)',
    'ABM (Accountancy, Business, and Management)',
    'HUMSS (Humanities and Social Sciences)',
    'GAS (General Academic Strand)',
    'TVL (Technical-Vocational-Livelihood)',
    'Sports Track',
    'Arts and Design Track',
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] backdrop-blur-xl text-white pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[900px] mx-auto px-4 md:px-10 text-center">
          <span className="inline-block bg-white/15 text-xs font-semibold px-3 py-1 rounded-full mb-4">SENIOR HIGH</span>
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Senior High Enrollment</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-xl mx-auto">Specialized academic tracks and strands for Grades 11 and 12.</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-[800px] mx-auto px-4 md:px-10 py-10 md:py-16">
        {submitted ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.1)] p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-[#1E4E8C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#1E4E8C]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-2">Enrollment Submitted!</h2>
            <p className="text-sm text-gray-600 mb-6">Your senior high enrollment application has been received. We will review it and contact you soon.</p>
            <a href="/" className="inline-block bg-[#1E4E8C] hover:bg-[#0B1F3A] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-200">
              Back to Home
            </a>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Info */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.1)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#1E4E8C] rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0B1F3A]">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name *</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Middle Name</label>
                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name *</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Age *</label>
                <input type="number" name="age" required value={formData.age} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
                <input type="date" name="dob" required value={formData.dob} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender *</label>
                <select name="gender" required value={formData.gender} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Strand *</label>
                <select name="strand" required value={formData.strand} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition">
                  <option value="">Select a strand</option>
                  {strands.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Info */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.1)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#1E4E8C] rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0B1F3A]">Parent / Guardian Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parent/Guardian Name *</label>
                <input type="text" name="parentName" required value={formData.parentName} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact Number *</label>
                <input type="tel" name="parentContact" required value={formData.parentContact} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Occupation</label>
                <input type="text" name="parentOccupation" value={formData.parentOccupation} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
              </div>
            </div>
          </div>

          {/* Address & Emergency */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.1)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#1E4E8C] rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0B1F3A]">Address & Emergency Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Complete Address *</label>
                <textarea name="address" required rows={2} value={formData.address} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Contact Person *</label>
                  <input type="text" name="emergencyContact" required value={formData.emergencyContact} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Phone Number *</label>
                  <input type="tel" name="emergencyPhone" required value={formData.emergencyPhone} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C] transition" />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[rgba(11,31,58,0.08)] shadow-[0_8px_32px_rgba(11,31,58,0.1)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#1E4E8C] rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0B1F3A]">Requirements Checklist</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: 'birthCert', label: 'PSA Birth Certificate' },
                { key: 'Form137', label: 'Form 137 / School Record from Previous School' },
                { key: 'goodMoral', label: 'Good Moral Character Certificate' },
                { key: 'medicalCert', label: 'Medical Certificate' },
                { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
                { key: 'previousDiploma', label: 'Junior High School Diploma / Certificate of Completion' },
              ].map((req) => (
                <label key={req.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input type="checkbox" name={req.key} checked={(formData.requirements as any)[req.key]} onChange={handleCheckbox}
                    className="w-4 h-4 rounded border-gray-300 text-[#1E4E8C] focus:ring-[#1E4E8C]" />
                  <span className="text-sm text-gray-700">{req.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={submitting}
              className="flex-1 bg-[#1E4E8C] hover:bg-[#0B1F3A] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#1E4E8C]/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Enrollment'}
            </button>
            <button type="button"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#0B1F3A] font-semibold py-3 px-6 rounded-xl text-sm transition">
              Cancel
            </button>
          </div>
        </form>
        )}
      </section>

      <Footer />
    </div>
  )
}
