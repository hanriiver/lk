import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

const MENU_ITEMS = [
  {
    key: 'menu', label: '메뉴판', path: '/menu',
    iconBg: '#4a3a1a',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4h12l-1.5 7a3 3 0 0 1-9 0z" stroke="#f0b352" strokeWidth="1.8" strokeLinejoin="round"/><line x1="12" y1="14" x2="12" y2="20" stroke="#f0b352" strokeWidth="1.8"/><line x1="8" y1="20" x2="16" y2="20" stroke="#f0b352" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    key: 'profile', label: '소개팅 프로필', path: '/profile',
    iconBg: '#4a2230',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9.5" cy="8.5" r="3.2" stroke="#ff7a9c" strokeWidth="1.8"/><path d="M4 19c0-3.3 2.5-5 5.5-5s5.5 1.7 5.5 5" stroke="#ff7a9c" strokeWidth="1.8" strokeLinecap="round"/><path d="M17 6.5c1-1.2 2.8-.3 2.8 1 0 1.3-1.6 2.2-2.8 3-1.2-.8-2.8-1.7-2.8-3 0-1.3 1.8-2.2 2.8-1z" fill="#ff7a9c"/></svg>,
  },
  {
    key: 'list', label: '매물대 확인하기', path: '/list',
    iconBg: '#3a2c52',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3" stroke="#b18cff" strokeWidth="1.8"/><circle cx="16" cy="8" r="3" stroke="#b18cff" strokeWidth="1.8"/><path d="M3 19c0-2.8 2.2-4.5 5-4.5" stroke="#b18cff" strokeWidth="1.8" strokeLinecap="round"/><path d="M11 19c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="#b18cff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    key: 'restaurant', label: '나만의 맛집', path: '/restaurant',
    iconBg: '#1e3f2a',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3c3.6 0 6 2.6 6 6 0 4.3-6 9.5-6 9.5S6 13.3 6 9c0-3.4 2.4-6 6-6z" stroke="#5fd07a" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.4" stroke="#5fd07a" strokeWidth="1.8"/></svg>,
  },
  {
    key: 'guestbook', label: '방명록', path: '/guestbook',
    iconBg: '#1d3350',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-1-2z" stroke="#5aa9ff" strokeWidth="1.8" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke="#5aa9ff" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="12.5" x2="13" y2="12.5" stroke="#5aa9ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    key: 'review', label: '영수증 리뷰', external: true,
    iconBg: '#143d28',
    icon: <span style={{ fontSize: 16, fontWeight: 900, color: '#03c75a' }}>N</span>,
  },
]

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Main() {
  const navigate = useNavigate()

  const handleClick = (item) => {
    if (item.external) {
      window.open('https://map.naver.com/p/search/' + encodeURIComponent('레몬과 김부각'), '_blank')
    } else {
      navigate(item.path)
    }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px 30px', marginTop: 20 }}>
          <div style={{ width: '100%', background: 'var(--bg)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)' }}>

            {/* Titlebar */}
            <div style={{ height: 42, display: 'flex', alignItems: 'center', padding: '0 14px', background: '#2a2a2c', borderBottom: '1px solid rgba(0,0,0,.4)', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--sub)', pointerEvents: 'none' }}>
                레몬과 김부각
              </div>
            </div>

            {/* Head */}
            <div style={{ padding: '26px 22px 18px', textAlign: 'center', borderBottom: '1px solid var(--hair)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: '#2c2c2e', margin: '0 auto 13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🍋</div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-.4px' }}>레몬과 김부각</h1>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--sub)', fontWeight: 500 }}>무엇을 해볼까요?</p>
            </div>

            {/* Menu list */}
            <div style={{ padding: 8 }}>
              {MENU_ITEMS.map(item => (
                <div
                  key={item.key}
                  onClick={() => handleClick(item)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 13,
                    padding: '13px 14px', borderRadius: 9, cursor: 'pointer',
                    transition: 'background .12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: item.iconBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 500, letterSpacing: '-.2px' }}>{item.label}</span>
                  <span style={{ color: 'var(--sub)', opacity: .7 }}>
                    {item.external ? <ExternalIcon /> : <Chevron />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
