import { create } from 'zustand'

export type AuthMode = 'login' | 'signup'

interface AuthModalState {
  open: boolean
  mode: AuthMode
  presetIdNumber: string
  presetEmail: string
  openAuth: (mode?: AuthMode) => void
  openSignupPrefilled: (idNumber: string, email: string) => void
  closeAuth: () => void
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  mode: 'login',
  presetIdNumber: '',
  presetEmail: '',
  openAuth: (mode = 'login') => set({ open: true, mode, presetIdNumber: '', presetEmail: '' }),
  openSignupPrefilled: (idNumber, email) => set({ open: true, mode: 'signup', presetIdNumber: idNumber, presetEmail: email }),
  closeAuth: () => set({ open: false, presetIdNumber: '', presetEmail: '' }),
}))
