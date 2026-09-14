import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/Toast'
import { Chatbot } from './components/Chatbot'
import MaintenanceMode from './components/MaintenanceMode'
import { Home } from './pages/Home'
import AdminLayout from './pages/admin/AdminLayout'

const SeniorHigh = lazy(() => import('./pages/SeniorHigh'))
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

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminEnrollment = lazy(() => import('./pages/admin/AdminEnrollment'))
const AdminPrograms = lazy(() => import('./pages/admin/AdminPrograms'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminSchoolInfo = lazy(() => import('./pages/admin/AdminSchoolInfo'))
const AdminHomepage = lazy(() => import('./pages/admin/AdminHomepage'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'))

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
        <ToastContainer />
        <Chatbot />
        <MaintenanceMode>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/senior-high" element={<SeniorHigh />} />
            <Route path="/campus/:campusId" element={<Campus />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/enrollment/kindergarten" element={<KindergartenEnrollment />} />
            <Route path="/enrollment/elementary" element={<ElementaryEnrollment />} />
            <Route path="/enrollment/junior-high" element={<JuniorHighEnrollment />} />
            <Route path="/enrollment/senior-high" element={<SeniorHighEnrollment />} />
            <Route path="/enrollment/college" element={<CollegeEnrollment />} />
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
              path="/admin/announcements"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminAnnouncements /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminNews /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminEvents /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrollment"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminEnrollment /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminPrograms /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminServices /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminGallery /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/school-info"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminSchoolInfo /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/homepage"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminHomepage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminSettings /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminUsers /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminLogs /></AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </MaintenanceMode>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
