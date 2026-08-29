import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      Loading...
    </div>
  )
}

function EventsPage() {
  const navigate = useNavigate()

  return <Events onSelectEvent={(id) => navigate(`/events/${id}`)} />
}

function EventDetailsPage() {
  const navigate = useNavigate()
  const { eventId } = useParams()

  return (
    <EventDetails
      eventId={eventId}
      onBack={() => navigate('/events')}
    />
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </Suspense>
  )
}