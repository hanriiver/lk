import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { useAdmin } from '../hooks/useAdmin'
import { generateQrUrl } from '../utils/qrUrl'

const REVIEW_URL = 'https://map.naver.com/p/search/' + encodeURIComponent('레몬과 김부각')

const ROWS = [
  {
    key: 'menu',
    path: '/menu',
    icClass: 'ic-menu',
    label: '메뉴판',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 4h12l-1.5 7a3 3 0 0 1-9 0z" stroke="#f0b352" strokeWidth="1.8" strokeLinejoin="round"/>
        <line x1="12" y1="14" x2="12" y2="20" stroke="#f0b352" strokeWidth="1.8"/>
        <line x1="8" y1="20" x2="16" y2="20" stroke="#f0b352" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'profile',
    path: '/profile',
    icClass: 'ic-profile',
    label: '소개팅 프로필',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9.5" cy="8.5" r="3.2" stroke="#ff7a9c" strokeWidth="1.8"/>
        <path d="M4 19c0-3.3 2.5-5 5.5-5s5.5 1.7 5.5 5" stroke="#ff7a9c" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M17 6.5c1-1.2 2.8-.3 2.8 1 0 1.3-1.6 2.2-2.8 3-1.2-.8-2.8-1.7-2.8-3 0-1.3 1.8-2.2 2.8-1z" fill="#ff7a9c"/>
      </svg>
    ),
  },
  {
    key: 'list',
    path: '/list',
    icClass: 'ic-list',
    label: '매물대 확인하기',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="3" stroke="#b18cff" strokeWidth="1.8"/>
        <circle cx="16" cy="8" r="3" stroke="#b18cff" strokeWidth="1.8"/>
        <path d="M3 19c0-2.8 2.2-4.5 5-4.5" stroke="#b18cff" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M11 19c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="#b18cff" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'food',
    path: '/restaurant',
    icClass: 'ic-food',
    label: '나만의 맛집',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3c3.6 0 6 2.6 6 6 0 4.3-6 9.5-6 9.5S6 13.3 6 9c0-3.4 2.4-6 6-6z" stroke="#5fd07a" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.4" stroke="#5fd07a" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    key: 'guest',
    path: '/guestbook',
    icClass: 'ic-guest',
    label: '방명록',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-1-2z" stroke="#5aa9ff" strokeWidth="1.8" strokeLinejoin="round"/>
        <line x1="8" y1="9" x2="16" y2="9" stroke="#5aa9ff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="8" y1="12.5" x2="13" y2="12.5" stroke="#5aa9ff" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'review',
    path: null,
    icClass: 'ic-review',
    label: '영수증 리뷰',
    icon: <span style={{ fontSize: 16, fontWeight: 900, color: '#03c75a' }}>N</span>,
    chevron: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Main() {
  const nav = useNavigate()
  const { admin } = useAdmin()
  const [qrUrl, setQrUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  const showQr = () => setQrUrl(generateQrUrl())

  const copyQr = () => {
    navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRow = (row) => {
    if (row.key === 'review') {
      window.open(REVIEW_URL, '_blank')
    } else {
      nav(row.path)
    }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="main-stage">
        <div className="mac-win">
          <div className="mac-titlebar">
            <div className="mac-lights">
              <span className="light-r" />
              <span className="light-y" />
              <span className="light-g" />
            </div>
            <div className="mac-ttl">레몬과 김부각</div>
          </div>

          <div className="mac-winhead">
            <div className="mac-logo">🍋</div>
            <h1>레몬과 김부각</h1>
            <p>무엇을 해볼까요?</p>
          </div>

          <div className="mac-list">
            {ROWS.map(row => (
              <div key={row.key} className="mac-row" onClick={() => handleRow(row)}>
                <span className={`mac-ic ${row.icClass}`}>{row.icon}</span>
                <span className="mac-lab">{row.label}</span>
                <span className="mac-chev">{row.chevron ?? <Chevron />}</span>
              </div>
            ))}
          </div>

          {admin && (
            <div style={{ padding: '8px 12px 14px', borderTop: '1px solid var(--hair)' }}>
              <button
                onClick={showQr}
                style={{
                  width: '100%', padding: '11px', borderRadius: 10, border: 0,
                  background: 'rgba(10,132,255,.12)', color: 'var(--accent)',
                  fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                QR 링크 생성
              </button>
              {qrUrl && (
                <div style={{ marginTop: 10 }}>
                  <div style={{
                    background: 'var(--card)', borderRadius: 10, padding: '10px 12px',
                    fontSize: 12, color: 'var(--sub)', wordBreak: 'break-all', lineHeight: 1.6,
                  }}>
                    {qrUrl}
                  </div>
                  <button
                    onClick={copyQr}
                    style={{
                      marginTop: 8, width: '100%', padding: '10px', borderRadius: 10, border: 0,
                      background: copied ? 'rgba(48,209,88,.15)' : 'var(--card)',
                      color: copied ? '#30d158' : 'var(--ink)',
                      fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {copied ? '복사됨!' : '링크 복사'}
                  </button>
                  <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--sub)', textAlign: 'center' }}>
                    이 링크로 QR코드를 만들어 테이블에 붙여두세요 (10분 유효)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
