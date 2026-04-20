import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import HomePage        from './pages/HomePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import AbonelikPage    from './pages/AbonelikPage'
import EditorPage      from './pages/EditorPage'
import AdminPage       from './pages/AdminPage'
import KapakPage       from './pages/KapakPage'
import UserPanelPage   from './pages/UserPanelPage'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">Yükleniyor…</div>
  if (!user)   return <Navigate to="/giris" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading)  return <div className="page-loading">Yükleniyor…</div>
  if (!user)    return <Navigate to="/giris" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/giris"     element={<LoginPage />} />
      <Route path="/kayit"     element={<RegisterPage />} />
      <Route path="/abonelik"  element={<RequireAuth><AbonelikPage /></RequireAuth>} />
      <Route path="/kapak"     element={<RequireAuth><KapakPage /></RequireAuth>} />
      <Route path="/editor"    element={<RequireAuth><EditorPage /></RequireAuth>} />
      <Route path="/panel"     element={<RequireAuth><UserPanelPage /></RequireAuth>} />
      <Route path="/admin"     element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}
