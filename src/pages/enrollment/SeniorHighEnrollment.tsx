import EnrollmentForm from './EnrollmentForm'
import { LEVEL_CONFIGS } from './levelConfigs'

export default function SeniorHighEnrollment() {
  return <EnrollmentForm config={LEVEL_CONFIGS['senior-high']} />
}