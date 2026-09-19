import EnrollmentForm from './EnrollmentForm'
import { LEVEL_CONFIGS } from './levelConfigs'

export default function ElementaryEnrollment() {
  return <EnrollmentForm config={LEVEL_CONFIGS['elementary']} />
}