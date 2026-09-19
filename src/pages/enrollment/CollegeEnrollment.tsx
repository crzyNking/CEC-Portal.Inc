import EnrollmentForm from './EnrollmentForm'
import { LEVEL_CONFIGS } from './levelConfigs'

export default function CollegeEnrollment() {
  return <EnrollmentForm config={LEVEL_CONFIGS['college']} />
}