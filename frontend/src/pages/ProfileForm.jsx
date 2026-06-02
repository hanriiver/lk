import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { useToast } from '../hooks/useToast'
import { createProfile } from '../api/profileApi'

const CUR_YEAR = new Date().getFullYear()

export default function ProfileForm() {
  const nav = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState({
    gender: '남성', birthYear: '', job: '',
    height: '', weight: '',
    ageMin: '', ageMax: '',
    ideal: '', detail: '',
  })

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const submit = async () => {
    if (!form.birthYear) { toast('출생연도를 입력하세요'); return }
    try {
      await createProfile({
        ...form,
        birthYear: +form.birthYear,
        height:   form.height  ? +form.height  : null,
        weight:   form.weight  ? +form.weight  : null,
        ageMin:   form.ageMin  ? +form.ageMin  : null,
        ageMax:   form.ageMax  ? +form.ageMax  : null,
      })
      toast('프로필 등록 완료!')
      nav('/list')
    } catch { toast('등록 실패') }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="lhead">
        <div className="toprow">
          <button onClick={() => nav('/')} style={{ background:'none', border:0, color:'var(--accent)', fontSize:15, cursor:'pointer', padding:0 }}>← 뒤로</button>
        </div>
        <h1>인연 등록 💌</h1>
      </div>

      <div className="scroll">
        <div style={{ padding:'12px 20px 40px' }}>

          <div className="field">
            <div className="field-label">성별</div>
            <div className="seg">
              {['남성','여성'].map(g => (
                <button key={g} className={`seg-btn ${form.gender===g?'sel':''}`} onClick={() => setForm(p=>({...p,gender:g}))}>{g}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field-label">출생연도 *</div>
            <input className="inp" type="number" placeholder={`예: ${CUR_YEAR-25}`} value={form.birthYear} onChange={f('birthYear')} />
          </div>

          <div className="field">
            <div className="field-label">직업</div>
            <input className="inp" placeholder="예: 직장인" value={form.job} onChange={f('job')} />
          </div>

          <div style={{display:'flex',gap:10}}>
            <div className="field" style={{flex:1}}><div className="field-label">키 (cm)</div>
              <input className="inp" type="number" placeholder="예: 170" value={form.height} onChange={f('height')} /></div>
            <div className="field" style={{flex:1}}><div className="field-label">몸무게 (kg)</div>
              <input className="inp" type="number" placeholder="예: 60" value={form.weight} onChange={f('weight')} /></div>
          </div>

          <div className="field">
            <div className="field-label">원하는 나이대</div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input className="inp" type="number" style={{flex:1}} placeholder="최소" value={form.ageMin} onChange={f('ageMin')} />
              <span style={{color:'var(--sub)'}}>~</span>
              <input className="inp" type="number" style={{flex:1}} placeholder="최대" value={form.ageMax} onChange={f('ageMax')} />
            </div>
          </div>

          <div className="field">
            <div className="field-label">이상형 (간단히)</div>
            <input className="inp" placeholder="예: 유머있고 따뜻한 분" value={form.ideal} onChange={f('ideal')} />
          </div>

          <div className="field">
            <div className="field-label">한마디</div>
            <textarea className="inp" rows={3} placeholder="자유롭게 소개해 주세요" value={form.detail} onChange={f('detail')} />
          </div>

          <button className="btn accent" style={{width:'100%',marginTop:6}} onClick={submit}>등록하기</button>
        </div>
      </div>
    </div>
  )
}
