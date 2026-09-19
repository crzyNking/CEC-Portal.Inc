import EnrollmentForm from './EnrollmentForm'
import { LEVEL_CONFIGS } from './levelConfigs'

export default function KindergartenEnrollment() {
  return <EnrollmentForm config={LEVEL_CONFIGS['kindergarten']} />
}