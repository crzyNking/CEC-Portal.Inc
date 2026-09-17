import { supabase } from './supabase'
import { useAuthStore } from '../store/authStore'

export type IdStatus = 'not_found' | 'unclaimed' | 'claimed' | 'invalid'

const PENDING_CLAIM_KEY = 'cec_pending_claim'

export const ID_NUMBER_MESSAGES = {
  not_found: 'ID Number not recognized. Please complete enrollment first.',
  claimed: 'This ID Number is already registered.',
  invalid: 'ID Number must be exactly 6 digits.',
}

export function isValidIdNumber(id: string): boolean {
  return /^[0-9]{6}$/.test(id)
}

export async function checkIdStatus(idNumber: string): Promise<IdStatus> {
  const { data, error } = await supabase.rpc('check_id_number_status', { p_id_number: idNumber })
  if (error) throw error
  return data as IdStatus
}

export async function claimStudentAccount(idNumber: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('claim_enrollment_record', { p_id_number: idNumber })
  if (error) throw error
  return data === true
}

export async function syncStudentProfileName(): Promise<void> {
  await supabase.rpc('sync_student_profile_name')
}

export function setPendingClaim(idNumber: string): void {
  try { localStorage.setItem(PENDING_CLAIM_KEY, idNumber) } catch { /* ignore */ }
}

export function getPendingClaim(): string | null {
  try { return localStorage.getItem(PENDING_CLAIM_KEY) } catch { return null }
}

export function clearPendingClaim(): void {
  try { localStorage.removeItem(PENDING_CLAIM_KEY) } catch { /* ignore */ }
}

export async function processPendingClaim(): Promise<boolean> {
  const id = getPendingClaim()
  if (!id) return false
  try {
    const ok = await claimStudentAccount(id)
    clearPendingClaim()
    if (ok) {
      await syncStudentProfileName()
      const userId = useAuthStore.getState().user?.id
      if (userId) await useAuthStore.getState().fetchProfile(userId)
    }
    return ok
  } catch {
    return false
  }
}

export async function loginWithIdNumber(idNumber: string, password: string): Promise<{ success: boolean; message: string }> {
  if (!isValidIdNumber(idNumber)) {
    return { success: false, message: ID_NUMBER_MESSAGES.invalid }
  }
  const { data: email, error } = await supabase.rpc('get_login_email_for_id', { p_id_number: idNumber })
  if (error || !email) {
    return { success: false, message: ID_NUMBER_MESSAGES.not_found }
  }
  const ok = await useAuthStore.getState().signInWithEmail(email, password)
  if (!ok) {
    const userId = useAuthStore.getState().user?.id
    if (userId) {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'login_failed',
        details: { method: 'id_number', id_number: idNumber },
      })
    }
    return { success: false, message: 'Incorrect password for this ID Number.' }
  }
  const userId = useAuthStore.getState().user?.id
  if (userId) {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'login',
      details: { method: 'id_number', id_number: idNumber },
    })
  }
  return { success: true, message: '' }
}

export function dashboardPathFor(role: string | null | undefined): string {
  if (role && ['super_admin', 'registrar', 'edp', 'accounting', 'faculty', 'other_admin', 'admin'].includes(role)) {
    return '/admin'
  }
  return '/dashboard'
}
