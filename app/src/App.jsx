import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import ReportPage from './pages/ReportPage'
import PricingPage from './pages/PricingPage'
import LoginPage from './pages/LoginPage'
import './App.css'

/* Protected route — redirects to /login if not authenticated */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

/* Auth route — redirects logged-in users away from /login */
function AuthRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />

      {/* Protected routes */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
