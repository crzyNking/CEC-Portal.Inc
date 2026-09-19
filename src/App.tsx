import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/Toast'
import { Chatbot } from './components/Chatbot'
import { AuthModal } from './components/AuthModal'
import MaintenanceMode from './components/MaintenanceMode'
import InstallPrompt from './components/InstallPrompt'
import UpdateNotification from './components/UpdateNotification'
import OfflineIndicator from './components/OfflineIndicator'
import SyncIndicator from './components/SyncIndicator'
import { Home } from './pages/Home'
import Programs from './pages/Programs'
import AdminLayout from './pages/admin/AdminLayout'

const ShareHandler = lazy(() => import('./pages/ShareHandler'))

const SeniorHigh = lazy(() => import('./pages/SeniorHigh'))
const JuniorHigh = lazy(() => import('./pages/JuniorHigh'))
const Kindergarten = lazy(() => import('./pages/Kindergarten'))
const Elementary = lazy(() => import('./pages/Elementary'))
const College = lazy(() => import('./pages/College'))
const BSIT = lazy(() => import('./pages/BSIT'))
const BSHM = lazy(() => import('./pages/BSHM'))
const BSTM = lazy(() => import('./pages/BSTM'))
const Criminology = lazy(() => import('./pages/Criminology'))
const BEED = lazy(() => import('./pages/BEED'))
const BSED = lazy(() => import('./pages/BSED'))
const KindergartenEnrollment = lazy(() => import('./pages/enrollment/KindergartenEnrollment'))
const ElementaryEnrollment = lazy(() => import('./pages/enrollment/ElementaryEnrollment'))
const JuniorHighEnrollment = lazy(() => import('./pages/enrollment/JuniorHighEnrollment'))
const SeniorHighEnrollment = lazy(() => import('./pages/enrollment/SeniorHighEnrollment'))
const CollegeEnrollment = lazy(() => import('./pages/enrollment/CollegeEnrollment'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })))
const Campus = lazy(() => import('./pages/Campus'))
const About = lazy(() => import('./pages/About'))
const News = lazy(() => import('./pages/News'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Enroll = lazy(() => import('./pages/Enroll'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const Unauthorized = lazy(() => import('./components/Unauthorized'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const PaymentsPage = lazy(() => import('./pages/Payments'))
const ClassesPage = lazy(() => import('./pages/Classes'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'))
const AdminSuper = lazy(() => import('./pages/admin/AdminSuper'))
const AdminRegistrar = lazy(() => import('./pages/admin/AdminRegistrar'))
const AdminEdp = lazy(() => import('./pages/admin/AdminEdp'))
const AdminAccounting = lazy(() => import('./pages/admin/AdminAccounting'))
const AdminFaculty = lazy(() => import('./pages/admin/AdminFaculty'))
const AdminOther = lazy(() => import('./pages/admin/AdminOther'))

function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0b2545] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#0b2545] font-medium text-sm">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModal />
        <ToastContainer />
        <OfflineIndicator />
        <SyncIndicator />
        <Chatbot />
        <InstallPrompt />
        <UpdateNotification />
        <MaintenanceMode>
        <ErrorBoundary>
        <Suspense fallback={<PageSpinner />}>
<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
<Route path="/programs/senior-high" element={<SeniorHigh />} />
<Route path="/programs/junior-high" element={<JuniorHigh />} />
<Route path="/programs/kindergarten" element={<Kindergarten />} />
<Route path="/programs/elementary" element={<Elementary />} />
<Route path="/programs/college" element={<College />} />
<Route path="/programs/bsit" element={<BSIT />} />
<Route path="/programs/bshm" element={<BSHM />} />
<Route path="/programs/bstm" element={<BSTM />} />
<Route path="/programs/criminology" element={<Criminology />} />
<Route path="/programs/beed" element={<BEED />} />
<Route path="/programs/bsed" element={<BSED />} />
<Route path="/campus/:campusId" element={<Campus />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/share" element={<ShareHandler />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/enrollment/kindergarten" element={<KindergartenEnrollment />} />
            <Route path="/enrollment/elementary" element={<ElementaryEnrollment />} />
            <Route path="/enrollment/junior-high" element={<JuniorHighEnrollment />} />
            <Route path="/enrollment/senior-high" element={<SeniorHighEnrollment />} />
            <Route path="/enrollment/college" element={<CollegeEnrollment />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <ClassesPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/super"
              element={
                <ProtectedRoute permission="manage_users">
                  <AdminLayout><AdminSuper /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrar"
              element={
                <ProtectedRoute permissions={['manage_enrollment', 'manage_id_numbers', 'manage_academic_records', 'manage_documents']}>
                  <AdminLayout><AdminRegistrar /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edp"
              element={
                <ProtectedRoute permissions={['manage_users', 'manage_system_settings', 'view_activity_logs']}>
                  <AdminLayout><AdminEdp /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accounting"
              element={
                <ProtectedRoute permissions={['manage_payments', 'view_students']}>
                  <AdminLayout><AdminAccounting /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute permissions={['manage_classes', 'manage_grades', 'manage_attendance']}>
                  <AdminLayout><AdminFaculty /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/other"
              element={
                <ProtectedRoute permissions={['manage_news', 'manage_events', 'manage_announcements']}>
                  <AdminLayout><AdminOther /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute permission="manage_announcements">
                  <AdminLayout><AdminAnnouncements /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute permission="manage_news">
                  <AdminLayout><AdminNews /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute permission="manage_events">
                  <AdminLayout><AdminEvents /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute permission="manage_system_settings">
                  <AdminLayout><AdminSettings /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute permission="manage_users">
                  <AdminLayout><AdminUsers /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute permission="view_activity_logs">
                  <AdminLayout><AdminLogs /></AdminLayout>
                </ProtectedRoute>
              }
            />

<Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
        </MaintenanceMode>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
