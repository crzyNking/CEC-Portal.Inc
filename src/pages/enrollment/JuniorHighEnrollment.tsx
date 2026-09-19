import EnrollmentForm from './EnrollmentForm'
import { LEVEL_CONFIGS } from './levelConfigs'

export default function JuniorHighEnrollment() {
  return <EnrollmentForm config={LEVEL_CONFIGS['junior-high']} />
}