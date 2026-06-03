import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { verifyPin } from '../api/authApi'
import { QR_URL } from '../utils/qrUrl'

export default function Admin() {
  const nav = useNavigate()
  const { admin, login, logout } = useAdmin()
  const toast = useToast()

  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!pin || loading) return
    setLoading(true)
    try {
      const { token } = await verifyPin(pin)
      login(token)
      toast('관리자 로그인 완료')
    } catch {
      setErr(true)
      setTimeout(() => { setPin(''); setErr(false) }, 600)
    } finally {
      setLoading(false)
    }
  }

  const copyQr = () => {
    navigator.clipboard.writeText(QR_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    setPin('')
    toast('로그아웃')
  }

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      background: '#1c1c1e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'Pretendard Variable, Pretendard, -apple-system, sans-serif',
    }}>

      {!admin ? (
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f5f5f7' }}>관리자</h2>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#98989f' }}>비밀번호를 입력하세요</p>
          </div>

          <input
            type="password"
            autoFocus
            value={pin}
            onChange={e => { setPin(e.target.value); setErr(false) }}
            placeholder="비밀번호"
            autoComplete="off"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 13, border: 'none',
              background: err ? 'rgba(255,59,48,.15)' : '#2c2c2e',
              color: '#f5f5f7', fontSize: 18, textAlign: 'center', letterSpacing: '0.2em',
              outline: err ? '2px solid #ff3b30' : '2px solid transparent',
              boxSizing: 'border-box', fontFamily: 'inherit', transition: 'outline .15s',
            }}
          />

          <button
            type="submit"
            disabled={!pin || loading}
            style={{
              marginTop: 14, width: '100%', padding: '14px', borderRadius: 13, border: 0,
              background: (!pin || loading) ? '#3a3a3c' : '#0a84ff',
              color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'background .15s',
            }}
          >
            {loading ? '확인 중…' : '로그인'}
          </button>

          <button
            type="button"
            onClick={() => nav('/')}
            style={{
              marginTop: 12, width: '100%', padding: '12px', borderRadius: 13, border: 0,
              background: 'none', color: '#98989f', fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            돌아가기
          </button>
        </form>

      ) : (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📲</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f5f5f7' }}>QR 링크</h2>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#98989f' }}>
              이 링크로 QR코드를 한 번만 만들어 테이블에 붙여두세요
            </p>
          </div>

          <div style={{
            background: '#2c2c2e', borderRadius: 13, padding: '14px 16px',
            fontSize: 13, color: '#98989f', wordBreak: 'break-all', lineHeight: 1.7,
            marginBottom: 12,
          }}>
            {QR_URL}
          </div>

          <button
            onClick={copyQr}
            style={{
              width: '100%', padding: '14px', borderRadius: 13, border: 0,
              background: copied ? 'rgba(48,209,88,.15)' : '#0a84ff',
              color: copied ? '#30d158' : '#fff',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', marginBottom: 10, transition: 'background .2s',
            }}
          >
            {copied ? '✓ 복사됨!' : '링크 복사'}
          </button>

          <div style={{
            background: 'rgba(255,159,10,.08)', border: '0.5px solid rgba(255,159,10,.2)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#ff9f0a', lineHeight: 1.6 }}>
              QR을 스캔하면 10분간 접속 가능합니다.<br />
              10분 후에는 QR을 다시 스캔해야 합니다.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px', borderRadius: 13, border: 0,
              background: 'none', color: '#636366', fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
