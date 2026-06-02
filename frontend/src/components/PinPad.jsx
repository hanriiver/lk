import { useState, useRef, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { verifyPin } from '../api/authApi'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'

export default function PinPad({ open, onClose, hint }) {
  const [buf, setBuf] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const toast = useToast()
  const inputRef = useRef()

  useEffect(() => {
    if (open) {
      setBuf(''); setErr(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const submit = async () => {
    if (!buf || loading) return
    setLoading(true)
    try {
      const { token } = await verifyPin(buf)
      login(token)
      onClose()
      toast('관리자 모드 ON')
    } catch {
      setErr(true)
      navigator.vibrate?.(80)
      setTimeout(() => { setBuf(''); setErr(false) }, 600)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pin-wrap">
        <div className="lock-big">{err ? '❌' : '🔒'}</div>
        <h3>관리자 모드</h3>
        <p>{hint || '비밀번호를 입력하세요.'}</p>

        <input
          ref={inputRef}
          type="password"
          className="inp"
          style={{
            textAlign: 'center',
            letterSpacing: '0.2em',
            fontSize: 18,
            borderColor: err ? '#ff3b30' : undefined,
            boxShadow: err ? '0 0 0 3px rgba(255,59,48,.2)' : undefined,
          }}
          placeholder="비밀번호"
          value={buf}
          onChange={e => { setBuf(e.target.value); setErr(false) }}
          onKeyDown={handleKey}
          autoComplete="off"
        />

        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={onClose}>취소</button>
          <button className="btn accent" onClick={submit} disabled={!buf || loading}>
            {loading ? '확인 중…' : '확인'}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
