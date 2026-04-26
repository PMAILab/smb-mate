import { createContext, useContext, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   Keys
────────────────────────────────────────────────────────────── */
const SESSION_KEY  = 'smbmate_session'   // currently logged-in user
const ACCOUNTS_KEY = 'smbmate_accounts'  // registry of all registered accounts

/* ──────────────────────────────────────────────────────────────
   Tiny "hash" — good enough for a mock (NOT for real security)
────────────────────────────────────────────────────────────── */
function mockHash(str) {
  // simple deterministic scramble so we don't store plaintext
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h.toString(36)
}

/* ──────────────────────────────────────────────────────────────
   Accounts registry helpers
────────────────────────────────────────────────────────────── */
function readAccounts() {
  try { return JSON.parse(sessionStorage.getItem(ACCOUNTS_KEY) || '{}') }
  catch { return {} }
}

function writeAccounts(accounts) {
  sessionStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

/** Normalise lookup key — phone or email, lowercase */
function normaliseKey(emailOrPhone) {
  if (!emailOrPhone) return null
  const trimmed = emailOrPhone.trim().toLowerCase()
  // If it looks like a phone number (only digits / starts with +91)
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length >= 10 && /^\d+$/.test(trimmed.replace(/[ +]/g, ''))) {
    return 'phone:' + digits.slice(-10)
  }
  return 'email:' + trimmed
}

/* ──────────────────────────────────────────────────────────────
   Session helpers
────────────────────────────────────────────────────────────── */
function readSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') }
  catch { return null }
}
function writeSession(user) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)) }
function clearSession()     { sessionStorage.removeItem(SESSION_KEY) }

/* ──────────────────────────────────────────────────────────────
   Context
────────────────────────────────────────────────────────────── */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())

  /* ── SIGN UP ──────────────────────────────────────────────── */
  const signup = useCallback((profile) => {
    const accounts = readAccounts()
    const emailKey = normaliseKey(profile.email)
    const phoneKey = normaliseKey(profile.phone)

    // Duplicate check
    if (emailKey && accounts[emailKey]) {
      throw new Error('An account with this email already exists. Please log in instead.')
    }
    if (phoneKey && accounts[phoneKey]) {
      throw new Error('An account with this phone number already exists. Please log in instead.')
    }

    const sessionUser = {
      name:         profile.name     || 'New User',
      email:        profile.email    || '',
      phone:        profile.phone    || '',
      businessName: profile.businessName || '',
      businessType: profile.businessType || '',
      city:         profile.city     || '',
      plan:         'Starter',
      credit:       500,
      loggedInAt:   new Date().toISOString(),
      provider:     'email',
    }

    const accountRecord = {
      ...sessionUser,
      passwordHash: mockHash(profile.password || ''),
    }

    // Store indexed by both email and phone for flexible lookup
    if (emailKey) accounts[emailKey] = accountRecord
    if (phoneKey) accounts[phoneKey] = accountRecord
    writeAccounts(accounts)

    writeSession(sessionUser)
    setUser(sessionUser)
    return sessionUser
  }, [])

  /* ── LOGIN ────────────────────────────────────────────────── */
  const login = useCallback((credentials) => {
    const accounts = readAccounts()
    const key = normaliseKey(credentials.email || credentials.phone || '')

    if (!key) throw new Error('Please enter your email or phone number.')

    const account = accounts[key]

    if (!account) {
      throw new Error(
        'No account found. Please sign up first or check your email/phone.'
      )
    }

    // Validate password
    const incomingHash = mockHash(credentials.password || '')
    if (account.passwordHash && account.passwordHash !== incomingHash) {
      throw new Error('Incorrect password. Please try again.')
    }

    const sessionUser = {
      name:         account.name,
      email:        account.email,
      phone:        account.phone,
      businessName: account.businessName,
      businessType: account.businessType,
      city:         account.city,
      plan:         account.plan   || 'Starter',
      credit:       account.credit ?? 500,
      loggedInAt:   new Date().toISOString(),
      provider:     account.provider || 'email',
    }

    writeSession(sessionUser)
    setUser(sessionUser)
    return sessionUser
  }, [])

  /* ── LOGIN WITH PHONE/OTP ─────────────────────────────────── */
  const loginWithOTP = useCallback((phone) => {
    const accounts = readAccounts()
    const phoneKey = normaliseKey(phone)
    const account  = accounts[phoneKey]

    if (!account) {
      throw new Error('No account with this number. Please sign up first.')
    }

    const sessionUser = {
      name:         account.name,
      email:        account.email,
      phone:        account.phone,
      businessName: account.businessName,
      businessType: account.businessType,
      city:         account.city,
      plan:         account.plan   || 'Starter',
      credit:       account.credit ?? 500,
      loggedInAt:   new Date().toISOString(),
      provider:     'otp',
    }

    writeSession(sessionUser)
    setUser(sessionUser)
    return sessionUser
  }, [])

  /* ── LOGIN WITH GOOGLE (mock) ─────────────────────────────── */
  /* 
    Behaviour:
    - First time: auto-registers a "Google" account and logs in
    - Subsequent times: retrieves the same account (simulates "already have a Google account")
  */
  const loginWithGoogle = useCallback(() => {
    const accounts = readAccounts()
    const googleEmail = 'google.user@gmail.com'
    const googleKey   = normaliseKey(googleEmail)

    let account = accounts[googleKey]

    if (!account) {
      // Auto-register on first Google login
      account = {
        name:         'Google User',
        email:        googleEmail,
        phone:        '',
        businessName: '',
        businessType: '',
        city:         '',
        plan:         'Starter',
        credit:       500,
        passwordHash: '',   // no password for Google accounts
        provider:     'google',
      }
      accounts[googleKey] = account
      writeAccounts(accounts)
    }

    const sessionUser = {
      name:         account.name,
      email:        account.email,
      phone:        account.phone,
      businessName: account.businessName,
      businessType: account.businessType,
      city:         account.city,
      plan:         account.plan   || 'Starter',
      credit:       account.credit ?? 500,
      loggedInAt:   new Date().toISOString(),
      provider:     'google',
    }

    writeSession(sessionUser)
    setUser(sessionUser)
    return sessionUser
  }, [])

  /* ── LOGOUT ───────────────────────────────────────────────── */
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  /* ── Helper: check if an email/phone is registered ───────── */
  const isRegistered = useCallback((emailOrPhone) => {
    const key = normaliseKey(emailOrPhone)
    if (!key) return false
    return !!readAccounts()[key]
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn:    !!user,
      login,
      signup,
      loginWithOTP,
      loginWithGoogle,
      logout,
      isRegistered,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
