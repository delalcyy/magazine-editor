import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function isActive(path) {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <header className="hdr">
      <div className="hdr-inner wrap">
        <nav className="hdr-nav">
          <Link to="/" className={`hdr-nav-a ${isActive('/')}`}>Ana Sayfa</Link>
          <Link to="/abonelik" className={`hdr-nav-a ${isActive('/abonelik')}`}>Abonelik</Link>
          {user && <Link to="/kapak"      className={`hdr-nav-a ${isActive('/kapak')}`}>Kapak Tasarla</Link>}
          {user && <Link to="/panel"      className={`hdr-nav-a ${isActive('/panel')}`}>Panelim</Link>}
          {isAdmin && <Link to="/admin"   className={`hdr-nav-a ${isActive('/admin')}`}>Admin</Link>}
        </nav>

        <Link to="/" className="hdr-logo">HATIRA DERGİ</Link>

        <div className="hdr-actions">
          {user ? (
            <div className="hdr-user">
              <span className="hdr-user-name">{user.ad || user.email}</span>
              <button onClick={handleLogout} className="hdr-btn hdr-btn-ghost">Çıkış</button>
            </div>
          ) : (
            <>
              <Link to="/giris"  className="hdr-link">Giriş</Link>
              <Link to="/kayit"  className="hdr-btn hdr-btn-dark">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
