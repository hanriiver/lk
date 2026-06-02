import { useState } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import PinPad from './PinPad'

export default function LockButton({ colorClass = '' }) {
  const { admin, logout } = useAdmin()
  const toast = useToast()
  const [pinOpen, setPinOpen] = useState(false)

  const handleClick = () => {
    if (admin) {
      logout()
      toast('관리자 모드 OFF')
    } else {
      setPinOpen(true)
    }
  }

  return (
    <>
      <button
        className={`lock-btn ${admin ? (colorClass || 'on') : ''}`}
        onClick={handleClick}
        title="관리자"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor"/>
          {admin
            ? <path d="M8 11V8a4 4 0 0 1 7.5-2" stroke="currentColor" strokeWidth="2" fill="none"/>
            : <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none"/>
          }
        </svg>
      </button>
      <PinPad open={pinOpen} onClose={() => setPinOpen(false)} />
    </>
  )
}
