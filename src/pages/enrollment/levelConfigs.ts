export interface RequirementItem {
  key: string
  label: string
}

export interface EnrollmentLevelConfig {
  level: string
  tag: string
  title: string
  hero: string
  successText: string
  mode: 'kindergarten' | 'grade' | 'strand' | 'college'
  gradeLevels: string[]
  strands: string[]
  degreePrograms: string[]
  requirements: RequirementItem[]
}

const COLLEGE_PROGRAMS = [
  'Bachelor of Elementary Education',
  'Bachelor of Secondary Education',
  'Bachelor of Science in Business Administration',
  'Bachelor of Science in Accountancy',
  'Bachelor of Science in Computer Science',
  'Bachelor of Science in Information Technology',
  'Bachelor of Arts in Communication',
  'Bachelor of Science in Psychology',
]

const STRANDS = [
  'STEM (Science, Technology, Engineering, and Mathematics)',
  'ABM (Accountancy, Business, and Management)',
  'HUMSS (Humanities and Social Sciences)',
  'GAS (General Academic Strand)',
  'TVL (Technical-Vocational-Livelihood)',
]

export const LEVEL_CONFIGS: Record<string, EnrollmentLevelConfig> = {
  kindergarten: {
    level: 'kindergarten',
    tag: 'KINDERGARTEN',
    title: 'Kindergarten Enrollment',
    hero: 'Give your child the best start with our play-based foundational learning program.',
    successText: 'Your kindergarten enrollment application has been received. We will review it and contact you soon.',
    mode: 'kindergarten',
    gradeLevels: [],
    strands: [],
    degreePrograms: [],
    requirements: [
      { key: 'birthCert', label: 'PSA Birth Certificate' },
      { key: 'Form137', label: 'Form 137 / School Record' },
      { key: 'goodMoral', label: 'Good Moral Character Certificate' },
      { key: 'medicalCert', label: 'Medical Certificate' },
      { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
      { key: 'interview', label: 'Parent/Guardian Interview' },
    ],
  },
  elementary: {
    level: 'elementary',
    tag: 'ELEMENTARY',
    title: 'Elementary Enrollment',
    hero: 'Building strong academic foundations for Grades 1 through 6.',
    successText: 'Your elementary enrollment application has been received. We will review it and contact you soon.',
    mode: 'grade',
    gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    strands: [],
    degreePrograms: [],
    requirements: [
      { key: 'birthCert', label: 'PSA Birth Certificate' },
      { key: 'Form137', label: 'Form 137 / School Record from Previous School' },
      { key: 'goodMoral', label: 'Good Moral Character Certificate' },
      { key: 'medicalCert', label: 'Medical Certificate' },
      { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
      { key: 'incomingGrade', label: 'Incoming Grade Level Verification' },
    ],
  },
  'junior-high': {
    level: 'junior-high',
    tag: 'JUNIOR HIGH',
    title: 'Junior High Enrollment',
    hero: 'Comprehensive secondary education for Grades 7 through 10.',
    successText: 'Your junior high enrollment application has been received. We will review it and contact you soon.',
    mode: 'grade',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    strands: [],
    degreePrograms: [],
    requirements: [
      { key: 'birthCert', label: 'PSA Birth Certificate' },
      { key: 'Form137', label: 'Form 137 / School Record from Previous School' },
      { key: 'goodMoral', label: 'Good Moral Character Certificate' },
      { key: 'medicalCert', label: 'Medical Certificate' },
      { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
      { key: 'previousDiploma', label: 'Previous Grade Diploma / Certificate of Completion' },
    ],
  },
  'senior-high': {
    level: 'senior-high',
    tag: 'SENIOR HIGH',
    title: 'Senior High Enrollment',
    hero: 'Specialized academic tracks and strands for Grades 11 and 12.',
    successText: 'Your senior high enrollment application has been received. We will review it and contact you soon.',
    mode: 'strand',
    gradeLevels: [],
    strands: STRANDS,
    degreePrograms: [],
    requirements: [
      { key: 'birthCert', label: 'PSA Birth Certificate' },
      { key: 'Form137', label: 'Form 137 / School Record from Previous School' },
      { key: 'goodMoral', label: 'Good Moral Character Certificate' },
      { key: 'medicalCert', label: 'Medical Certificate' },
      { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
      { key: 'previousDiploma', label: 'Junior High School Diploma / Certificate of Completion' },
    ],
  },
  college: {
    level: 'college',
    tag: 'COLLEGE',
    title: 'College Enrollment',
    hero: 'Begin your higher education journey with Cebu Eastern College.',
    successText: 'Your college enrollment application has been received. We will review it and contact you soon.',
    mode: 'college',
    gradeLevels: [],
    strands: [],
    degreePrograms: COLLEGE_PROGRAMS,
    requirements: [
      { key: 'birthCert', label: 'PSA Birth Certificate' },
      { key: 'Form137', label: 'Form 137 / Transcript of Records' },
      { key: 'goodMoral', label: 'Good Moral Character Certificate' },
      { key: 'medicalCert', label: 'Medical Certificate' },
      { key: 'idPhotos', label: '2x2 ID Photos (4 copies)' },
      { key: 'shsDiploma', label: 'Senior High School Diploma / Certificate of Graduation' },
      { key: 'ncaeResult', label: 'NCAE Result (if available)' },
    ],
  },
}
