import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [time, setTime] = useState(getTime())

  function getTime() {
    const d = new Date()
    let h = d.getHours() % 12 || 12
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  }

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="statusbar">
      <span>{time}</span>
      <span className="right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="1"/>
          <rect x="4.5" y="5" width="3" height="7" rx="1"/>
          <rect x="9" y="2.5" width="3" height="9.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1"/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.4c2.3 0 4.4.9 6 2.4l-1.3 1.3a6.7 6.7 0 0 0-9.4 0L2.5 4.8a8.5 8.5 0 0 1 6-2.4zM8.5 6c1.2 0 2.3.5 3.1 1.3L8.5 10.4 5.4 7.3A4.4 4.4 0 0 1 8.5 6z"/>
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="1" y="1" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity=".4"/>
          <rect x="2.5" y="2.5" width="16" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23" y="4" width="2" height="5" rx="1" fill="currentColor" fillOpacity=".4"/>
        </svg>
      </span>
    </div>
  )
}
