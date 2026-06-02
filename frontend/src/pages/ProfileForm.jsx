import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { useToast } from '../hooks/useToast'
import { createProfile } from '../api/profileApi'

const CURRENT_YEAR = new Date().getFullYear()

export default function ProfileForm() {
  const navigate = useNavigate()
  const toast = useToast()

  const [gender, setGender] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [job, setJob] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [ideal, setIdeal] = useState('')

  const submit = async () => {
    if (!gender) { toast('성별을 선택하세요'); return }
    if (!birthYear) { toast('출생연도를 입력하세요'); return }
    const year = parseInt(birthYear)
    if (isNaN(year) || year < 1950 || year > CURRENT_YEAR - 18) { toast('출생연도를 확인하세요'); return }
    try {
      await createProfile({
        gender, birthYear: year,
        job: job || null,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        ageMin: ageMin ? parseInt(ageMin) : null,
        ageMax: ageMax ? parseInt(ageMax) : null,
        ideal: ideal || null,
      })
      toast('프로필이 등록되었어요 💌')
      navigate('/list')
    } catch { toast('등록 실패') }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll">
        <div className="lhead">
          <div className="toprow">
            <h1>소개팅 프로필</h1>
            <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: '50%', border: 0, background: 'rgba(120,120,128,.14)', color: 'var(--sub2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="count">레몬과 김부각 매물대에 등록됩니다</div>
        </div>

        <div style={{ padding: '12px 20px 120px' }}>
          {/* Gender */}
          <div className="field">
            <div className="field-label">성별 *</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['남성', '여성'].map(g => (
                <div key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: '12px', borderRadius: 11, textAlign: 'center', fontWeight: 600, fontSize: 16, cursor: 'pointer', background: gender === g ? (g === '남성' ? '#5aa9ff' : '#ff6b9d') : 'var(--card)', color: gender === g ? '#fff' : 'var(--ink)', border: `1px solid ${gender === g ? 'transparent' : 'var(--hair)'}` }}>
                  {g === '남성' ? '🙋‍♂️' : '🙋‍♀️'} {g}
                </div>
              ))}
            </div>
          </div>

          <div className="field"><div className="field-label">출생연도 *</div><input className="inp" type="number" placeholder="예: 1995" value={birthYear} onChange={e => setBirthYear(e.target.value)} /></div>
          <div className="field"><div className="field-label">직업</div><input className="inp" placeholder="예: IT 개발자" value={job} onChange={e => setJob(e.target.value)} /></div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">키 (cm)</div>
              <input className="inp" type="number" placeholder="170" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">몸무게 (kg)</div>
              <input className="inp" type="number" placeholder="60" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <div className="field-label">원하는 나이대</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input className="inp" type="number" style={{ width: 100 }} placeholder="최소" value={ageMin} onChange={e => setAgeMin(e.target.value)} />
              <span style={{ color: 'var(--sub2)' }}>~</span>
              <input className="inp" type="number" style={{ width: 100 }} placeholder="최대" value={ageMax} onChange={e => setAgeMax(e.target.value)} />
              <span style={{ color: 'var(--sub2)' }}>세</span>
            </div>
          </div>

          <div className="field"><div className="field-label">이상형 한줄</div><textarea className="inp" rows={3} placeholder="예: 고양이상, 잘 웃는 사람" value={ideal} onChange={e => setIdeal(e.target.value)} /></div>

          <div className="actions">
            <button className="btn ghost" onClick={() => navigate(-1)}>취소</button>
            <button className="btn primary" onClick={submit}>등록하기 💌</button>
          </div>
        </div>
      </div>
    </div>
  )
}
