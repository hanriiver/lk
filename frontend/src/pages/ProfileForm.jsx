import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { useToast } from '../hooks/useToast'
import { createProfile } from '../api/profileApi'

const CUR_YEAR = new Date().getFullYear()

export default function ProfileForm() {
  const nav = useNavigate()
  const toast = useToast()
  const fileRef = useRef()

  const [form, setForm] = useState({
    gender: '남성', birthYear: '', job: '',
    height: '', weight: '',
    ageMin: '', ageMax: '',
    ideal: '', detail: '',
    instagramId: '',
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const pickFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    if (!form.birthYear) { toast('출생연도를 입력하세요'); return }

    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify({
      gender:      form.gender,
      birthYear:   +form.birthYear,
      job:         form.job || null,
      height:      form.height  ? +form.height  : null,
      weight:      form.weight  ? +form.weight  : null,
      ageMin:      form.ageMin  ? +form.ageMin  : null,
      ageMax:      form.ageMax  ? +form.ageMax  : null,
      ideal:       form.ideal   || null,
      detail:      form.detail  || null,
      instagramId: form.instagramId || null,
    })], { type: 'application/json' }))
    if (photo) fd.append('photo', photo)

    try {
      await createProfile(fd)
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

          {/* 사진 */}
          <div className="field">
            <div className="field-label">사진</div>
            <button className="photo-pick" onClick={() => fileRef.current.click()}>
              {preview
                ? <img src={preview} alt="" />
                : <><span style={{ fontSize:28 }}>📷</span><span>사진 선택</span></>
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={pickFile} />
          </div>

          {/* 사진·연락처 비공개 안내 */}
          <div style={{
            background: 'rgba(10,132,255,.10)',
            border: '0.5px solid rgba(10,132,255,.25)',
            borderRadius: 10,
            padding: '10px 13px',
            marginBottom: 16,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize:15, flexShrink:0 }}>🔒</span>
            <p style={{ margin:0, fontSize:12.5, color:'var(--accent)', lineHeight:1.55 }}>
              <strong>사진과 연락처(인스타 아이디)는 사장님만 확인할 수 있어요.</strong><br />
              일반 손님에게는 표시되지 않으니 안심하고 입력하세요.
            </p>
          </div>

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

          <div style={{ display:'flex', gap:10 }}>
            <div className="field" style={{flex:1}}>
              <div className="field-label">키 (cm)</div>
              <input className="inp" type="number" placeholder="예: 170" value={form.height} onChange={f('height')} />
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field-label">몸무게 (kg)</div>
              <input className="inp" type="number" placeholder="예: 60" value={form.weight} onChange={f('weight')} />
            </div>
          </div>

          <div className="field">
            <div className="field-label">원하는 나이대</div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input className="inp" type="number" style={{flex:1}} placeholder="최소" value={form.ageMin} onChange={f('ageMin')} />
              <span style={{ color:'var(--sub)' }}>~</span>
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

          {/* 인스타 아이디 - 비공개 강조 */}
          <div className="field">
            <div className="field-label">
              인스타 아이디
              <span style={{ marginLeft:6, fontSize:11, color:'var(--accent)', fontWeight:600 }}>🔒 사장님만 공개</span>
            </div>
            <input className="inp" placeholder="예: @lemon_kim (선택)" value={form.instagramId} onChange={f('instagramId')} />
          </div>

          <button className="btn accent" style={{ width:'100%', marginTop:6 }} onClick={submit}>등록하기</button>
        </div>
      </div>
    </div>
  )
}
