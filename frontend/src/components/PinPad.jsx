import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { verifyPin } from '../api/authApi'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'

export default function PinPad({ open, onClose, hint }) {
  const [buf, setBuf] = useState('')
  const [err, setErr] = useState(false)
  const { login } = useAdmin()
  const toast = useToast()

  const press = async (k) => {
    if (buf.length >= 4) return
    const next = buf + k
    setBuf(next)
    if (next.length === 4) {
      try {
        const { token } = await verifyPin(next)
        login(token)
        onClose()
        toast('관리자 모드 ON')
      } catch {
        setErr(true)
        navigator.vibrate?.(80)
        setTimeout(() => { setBuf(''); setErr(false) }, 500)
      }
    }
  }

  const del = () => setBuf(b => b.slice(0, -1))

  const keys = ['1','2','3','4','5','6','7','8','9','blank','0','del']

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pin-wrap">
        <div className="lock-big">🔒</div>
        <h3>관리자 모드</h3>
        <p>{hint || '관리자 기능을 사용하려면 PIN을 입력하세요.'}</p>
        <div className="pin-dots">
          {[0,1,2,3].map(i => (
            <div key={i} className={`pin-dot ${i < buf.length ? 'f' : ''} ${err ? 'err' : ''}`} />
          ))}
        </div>
        <div className="keypad">
          {keys.map((k, i) => {
            if (k === 'blank') return <button key={i} className="key blank" disabled />
            if (k === 'del')   return <button key={i} className="key del" onClick={del}>지움</button>
            return <button key={i} className="key" onClick={() => press(k)}>{k}</button>
          })}
        </div>
        <div className="pin-hint">기본 PIN: 1234</div>
      </div>
    </BottomSheet>
  )
}
