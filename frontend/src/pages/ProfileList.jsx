import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getProfiles, deleteProfile } from '../api/profileApi'

const CUR_YEAR = new Date().getFullYear()

export default function ProfileList() {
  const nav = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [tab, setTab]   = useState('남성')
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const data = await getProfiles(tab)
      setItems(Array.isArray(data) ? data : [])
    } catch { toast('불러오기 실패') }
  }

  useEffect(() => { load() }, [tab])

  const del = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    try { await deleteProfile(id); load(); toast('삭제 완료') }
    catch { toast('삭제 실패') }
  }

  const age = (y) => CUR_YEAR - y + 1

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="lhead">
        <div className="toprow">
          <button onClick={() => nav('/')} style={{ background:'none', border:0, color:'var(--accent)', fontSize:15, cursor:'pointer', padding:0 }}>← 뒤로</button>
          <LockButton />
        </div>
        <h1>인연 목록 👥</h1>
        <div className="count">{items.length}명</div>
      </div>

      <div className="scroll">
        <div style={{ padding:'8px 14px 4px' }}>
          <div className="seg">
            {['남성','여성'].map(g => (
              <button key={g} className={`seg-btn ${tab===g?'sel':''}`} onClick={() => setTab(g)}>{g}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:'10px 14px 40px' }}>
          {items.map(p => (
            <div key={p.id} className="card">
              <div className="prof-card">
                <div className="prof-head">
                  {admin && p.photoUrl
                    ? <img src={p.photoUrl} alt="" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                    : <div className="prof-avatar">{p.gender==='남성'?'👨':'👩'}</div>
                  }
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="prof-name">{age(p.birthYear)}세 {p.gender}</div>
                    <div className="prof-sub">{p.job || '직업 미입력'}</div>
                  </div>
                  {admin && <button className="del-btn" style={{position:'static',marginLeft:'auto'}} onClick={()=>del(p.id)}>✕</button>}
                </div>

                {(p.height||p.weight||p.ageMin||p.ageMax) && (
                  <div className="prof-tags">
                    {p.height && <span className="tag">{p.height}cm</span>}
                    {p.weight && <span className="tag">{p.weight}kg</span>}
                    {(p.ageMin||p.ageMax) && <span className="tag">{p.ageMin||'?'}~{p.ageMax||'?'}세 희망</span>}
                  </div>
                )}

                {p.ideal  && <div className="prof-text">💛 {p.ideal}</div>}
                {p.detail && <div className="prof-text" style={{marginTop:4}}>📝 {p.detail}</div>}

                {admin && p.instagramId && (
                  <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:11, background:'rgba(10,132,255,.12)', color:'var(--accent)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>
                      🔒 {p.instagramId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="fab accent" onClick={() => nav('/profile')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  )
}
