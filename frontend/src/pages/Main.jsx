import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'

const MENUS = [
  { path: '/menu',       icon: '🍺', label: '주류 메뉴',   sub: '칵테일·와인·맥주·소주' },
  { path: '/profile',    icon: '💌', label: '인연 등록',   sub: '프로필 카드 작성' },
  { path: '/list',       icon: '👥', label: '인연 목록',   sub: '등록된 프로필 보기' },
  { path: '/restaurant', icon: '🍜', label: '맛집 추천',   sub: '단골·추천 맛집 모음' },
  { path: '/guestbook',  icon: '📖', label: '방명록',       sub: '한마디 남기기' },
]

export default function Main() {
  const nav = useNavigate()
  const { admin } = useAdmin()

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll">
        {/* hero */}
        <div style={{ padding: '28px 24px 16px', position: 'relative' }}>
          <LockButton />
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 500 }}>Welcome to</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '4px 0 0', letterSpacing: -1 }}>
              🍋 레몬과 김부각
            </h1>
            <p style={{ fontSize: 14, color: 'var(--sub)', marginTop: 6 }}>
              작은 술집, 큰 인연
            </p>
          </div>
        </div>

        {/* grid */}
        <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MENUS.map(m => (
            <button
              key={m.path}
              onClick={() => nav(m.path)}
              style={{
                background: 'var(--card)', border: '0.5px solid var(--hair)',
                borderRadius: 18, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{ fontSize: 30 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{m.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
