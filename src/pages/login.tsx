import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const redirectPath = (router.query.redirect as string) || '/dashboard'
  const urlError = router.query.error as string

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push(redirectPath)
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In — Julian Anderson</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="login-page">
        {/* Decorative background */}
        <div className="login-bg" aria-hidden="true">
          <div className="login-bg-circle login-bg-circle--1" />
          <div className="login-bg-circle login-bg-circle--2" />
          <div className="login-bg-grain" />
        </div>

        <main className="login-container">
          {/* Back link */}
          <Link href="/" className="login-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to site</span>
          </Link>

          <div className="login-card">
            {/* Header */}
            <header className="login-header">
              <div className="login-logo">
                <span className="login-logo-mark">J</span>
              </div>
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">Sign in to your dashboard</p>
            </header>

            {/* Error messages */}
            {(error || urlError) && (
              <div className="login-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>
                  {urlError === 'unauthorized'
                    ? 'Access denied. This dashboard is private.'
                    : error
                  }
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="login-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <footer className="login-footer">
              <p>Private dashboard — invitation only</p>
            </footer>
          </div>
        </main>

        <style jsx>{`
          .login-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          /* Background effects */
          .login-bg {
            position: fixed;
            inset: 0;
            pointer-events: none;
          }

          .login-bg-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.4;
          }

          .login-bg-circle--1 {
            width: 600px;
            height: 600px;
            background: var(--color-accent-subtle);
            top: -200px;
            right: -100px;
          }

          .login-bg-circle--2 {
            width: 400px;
            height: 400px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            bottom: -100px;
            left: -100px;
            opacity: 0.3;
          }

          .login-bg-grain {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
          }

          .login-container {
            width: 100%;
            max-width: 420px;
            position: relative;
            z-index: 1;
            animation: var(--animate-slide-up);
          }

          .login-back {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-text-muted);
            font-size: 0.875rem;
            margin-bottom: 2rem;
            transition: color 0.2s ease;
          }

          .login-back:hover {
            color: var(--color-text);
          }

          .login-card {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: var(--shadow-card);
          }

          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .login-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
            border-radius: 14px;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
          }

          .login-logo-mark {
            font-family: var(--font-display);
            font-size: 1.75rem;
            color: white;
            font-weight: 400;
            letter-spacing: -0.02em;
          }

          .login-title {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 400;
            color: var(--color-text);
            margin: 0 0 0.5rem;
            letter-spacing: -0.02em;
          }

          .login-subtitle {
            font-size: 0.9375rem;
            color: var(--color-text-muted);
            margin: 0;
          }

          .login-error {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 1rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            color: #991b1b;
            font-size: 0.875rem;
            line-height: 1.5;
          }

          .login-error svg {
            flex-shrink: 0;
            margin-top: 1px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .login-field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .login-label {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--color-text-secondary);
            letter-spacing: 0.01em;
          }

          .login-input {
            width: 100%;
            padding: 0.875rem 1rem;
            font-size: 0.9375rem;
            font-family: var(--font-body);
            color: var(--color-text);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 10px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .login-input::placeholder {
            color: var(--color-text-muted);
          }

          .login-input:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px var(--color-accent-subtle);
          }

          .login-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.9375rem 1.5rem;
            font-size: 0.9375rem;
            font-weight: 500;
            font-family: var(--font-body);
            color: white;
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
            margin-top: 0.5rem;
          }

          .login-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
          }

          .login-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .login-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .login-footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--color-border-subtle);
            text-align: center;
          }

          .login-footer p {
            font-size: 0.8125rem;
            color: var(--color-text-muted);
            margin: 0;
          }

          @media (max-width: 480px) {
            .login-page {
              padding: 1rem;
            }

            .login-card {
              padding: 1.75rem;
            }

            .login-title {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </>
  )
}
