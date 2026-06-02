import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getProfiles, deleteProfile } from '../api/profileApi'

const CURRENT_YEAR = new Date().getFullYear()

function ageOf(birthYear) { return birthYear ? CURRENT_YEAR - parseInt(birthYear) : null }
function born2(birthYear) { return birthYear ? String(birthYear).slice(2) + '년생' : '' }

export default function ProfileList() {
  const navigate = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [males, setMales] = useState([])
  const [females, setFemales] = useState([])
  const [tab, setTab] = useState('남성')

  const load = async () => {
    try {
      const data = await getProfiles()
      setMales(data.males || [])
      setFemales(data.females || [])
    } catch { toast('불러오기 실패') }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    try { await deleteProfile(id); toast('삭제되었어요'); load() }
    catch { toast('삭제 실패') }
  }

  const rows = tab === '남성' ? males : females

  return (
    <div className="phone" style={{ background: 'var(--bg)' }}>
      <div className="island" />
      <StatusBar />

      {/* macOS-style toolbar */}
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(48,48,50,.72)', backdropFilter: 'saturate(180%) blur(22px)', borderBottom: '0.5px solid var(--hair)', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span onClick={() => navigate('/')} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', cursor: 'pointer', display: 'block' }} title="홈으로" />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 14, fontWeight: 600, pointerEvents: 'none' }}>매물대</div>
        <div style={{ marginLeft: 'auto' }}><LockButton /></div>
      </div>

      {/* Tab segment */}
      <div style={{ flexShrink: 0, padding: '16px 18px 10px' }}>
        <div style={{ display: 'flex', background: 'var(--field)', borderRadius: 10, padding: 3, gap: 3 }}>
          {[
            { g: '남성', label: '🙋‍♂️ 남자', cnt: males.length, color: '#5aa9ff' },
            { g: '여성', label: '🙋‍♀️ 여자', cnt: females.length, color: '#ff6b9d' },
          ].map(({ g, label, cnt, color }) => (
            <button key={g} onClick={() => setTab(g)} style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: tab === g ? '#fff' : 'var(--sub2)', background: tab === g ? color : 'transparent', border: 0, borderRadius: 8, padding: '9px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background .15s, color .15s' }}>
              {label} <span style={{ fontSize: 11, opacity: .7 }}>{cnt}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 80px' }}>
        <div style={{ fontSize: 12, color: 'var(--sub)', margin: '4px 2px 12px' }}>
          {rows.length}명의 {tab === '남성' ? '남성' : '여성'} 프로필
        </div>
        {rows.length === 0 ? (
          <div className="empty"><span className="e-ic">🗒️</span>아직 등록된 프로필이 없어요</div>
        ) : rows.map(p => {
          const isM = p.gender === '남성'
          const age = ageOf(p.birthYear)
          const range = (p.ageMin && p.ageMax) ? `${p.ageMin}~${p.ageMax}세` : ''
          return (
            <div key={p.id} style={{ background: 'var(--card)', borderRadius: 13, padding: '15px 16px', marginBottom: 11, position: 'relative' }}>
              {admin && (
                <button onClick={() => remove(p.id)} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,69,58,.22)', color: '#ff6961', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: isM ? 'rgba(90,169,255,.18)' : 'rgba(255,107,157,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{isM ? '🙋‍♂️' : '🙋‍♀️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{age ? `${age}세` : '나이 미입력'}<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--sub)', marginLeft: 6 }}>{born2(p.birthYear)}</span></div>
                  <div style={{ fontSize: 13, color: 'var(--sub2)', marginTop: 2 }}>{p.job || '직업 미입력'}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: isM ? 'rgba(90,169,255,.18)' : 'rgba(255,107,157,.18)', color: isM ? '#5aa9ff' : '#ff6b9d' }}>{isM ? '남' : '여'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 13 }}>
                {[['키', p.height, 'cm'], ['몸무게', p.weight, 'kg']].map(([k, v, u]) => (
                  <div key={k} style={{ flex: 1, background: 'var(--field)', borderRadius: 9, padding: '9px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--sub)', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v ? <>{v}<span style={{ fontSize: 11, color: 'var(--sub2)', marginLeft: 1 }}>{u}</span></> : '—'}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--field)', borderRadius: 9, padding: '11px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" fill="#0a84ff"/></svg>이상형
                </div>
                {range && <div style={{ fontSize: 13, fontWeight: 600 }}>{range}</div>}
                {p.ideal && <div style={{ fontSize: 13, color: 'var(--sub2)', lineHeight: 1.5, marginTop: 3 }}>{p.ideal}</div>}
                {!range && !p.ideal && <div style={{ fontSize: 13, color: 'var(--sub2)' }}>—</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ flexShrink: 0, padding: '11px 16px', background: 'rgba(48,48,50,.72)', backdropFilter: 'saturate(180%) blur(22px)', borderTop: '0.5px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11.5, color: 'var(--sub)', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 8.2-7 9.6C8 19.2 5 15.4 5 11V6z" stroke="#8e8e93" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          사진·연락처는 비공개입니다
        </span>
        <button onClick={() => navigate('/profile')} style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, padding: '7px 16px', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', boxShadow: '0 1px 2px rgba(10,132,255,.4)' }}>
          프로필 작성하기
        </button>
      </div>
    </div>
  )
}
