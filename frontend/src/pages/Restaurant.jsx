import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import BottomSheet from '../components/BottomSheet'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../api/restaurantApi'

const CATS = ['전체','한식','일식','중식','양식','기타']
const CAT_DOT = { 한식:'dot-korean', 일식:'dot-japanese', 중식:'dot-chinese', 양식:'dot-western', 기타:'dot-etc' }
const CAT_EMOJI = { 한식:'🍖', 일식:'🍣', 중식:'🥟', 양식:'🍝', 기타:'🍽️' }

export default function Restaurant() {
  const nav = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems]   = useState([])
  const [cat, setCat]       = useState('전체')
  const [q, setQ]           = useState('')
  const [sheet, setSheet]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState({ name:'', category:'한식', location:'', recommender:'', review:'', recMenus:'' })

  const load = async () => {
    try { setItems(await getRestaurants(cat==='전체'?'':cat, q)) }
    catch { toast('불러오기 실패') }
  }

  useEffect(() => { load() }, [cat, q])

  const openAdd = () => {
    setEditing(null)
    setForm({ name:'', category:'한식', location:'', recommender:'', review:'', recMenus:'' })
    setSheet(true)
  }

  const openEdit = (item) => {
    if (!admin) return
    setEditing(item)
    setForm({ name:item.name, category:item.category, location:item.location||'',
      recommender:item.recommender||'', review:item.review||'',
      recMenus: item.recMenus?.join(', ') || '' })
    setSheet(true)
  }

  const submit = async () => {
    const body = {
      name: form.name, category: form.category,
      location: form.location||null, recommender: form.recommender||null,
      review: form.review||null,
      recMenus: form.recMenus ? form.recMenus.split(',').map(s=>s.trim()).filter(Boolean) : [],
    }
    try {
      if (editing) await updateRestaurant(editing.id, body)
      else         await createRestaurant(body)
      setSheet(false); load(); toast(editing ? '수정 완료' : '등록 완료')
    } catch { toast('저장 실패') }
  }

  const del = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    try { await deleteRestaurant(id); load(); toast('삭제 완료') }
    catch { toast('삭제 실패') }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="lhead">
        <div className="toprow">
          <button onClick={() => nav('/')} style={{ background:'none', border:0, color:'var(--accent)', fontSize:15, cursor:'pointer', padding:0 }}>← 뒤로</button>
          <LockButton colorClass="food" />
        </div>
        <h1>맛집 추천 🍜</h1>
        <div className="count">{items.length}곳</div>
      </div>

      <div className="searchwrap">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="이름·위치·리뷰 검색" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="scroll">
        <div className="chipbar">
          {CATS.map(c => (
            <button key={c} className={`chip ${cat===c?'sel':''}`} onClick={() => setCat(c)}>
              {c !== '전체' && <span className={`dot ${CAT_DOT[c]}`} />}{c}
            </button>
          ))}
        </div>

        <div style={{ padding:'12px 14px 80px' }}>
          {items.map(item => (
            <div key={item.id} className="card" onClick={() => openEdit(item)}>
              <div className="rest-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div className="rest-name">{CAT_EMOJI[item.category]||'🍽️'} {item.name}</div>
                    <div className="rest-meta">{item.category}{item.location ? ` · ${item.location}` : ''}{item.recommender ? ` · 추천: ${item.recommender}` : ''}</div>
                  </div>
                  {admin && <button className="del-btn" style={{position:'static'}} onClick={e=>{e.stopPropagation();del(item.id)}}>✕</button>}
                </div>
                {item.review && <div className="rest-review">{item.review}</div>}
                {item.recMenus?.length > 0 && (
                  <div className="rest-menus">
                    {item.recMenus.map((m,i) => <span key={i} className="rest-menu-tag">{m}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {admin && <button className="fab" onClick={openAdd}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg></button>}

      <BottomSheet open={sheet} onClose={() => setSheet(false)}>
        <div className="form-title">{editing ? '맛집 수정' : '맛집 등록'}</div>
        <div className="field"><div className="field-label">가게 이름 *</div>
          <input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="가게 이름" /></div>
        <div className="field"><div className="field-label">카테고리</div>
          <select className="inp" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            {CATS.filter(c=>c!=='전체').map(c=><option key={c}>{c}</option>)}
          </select></div>
        <div className="field"><div className="field-label">위치</div>
          <input className="inp" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="예: 홍대입구역 3번 출구" /></div>
        <div className="field"><div className="field-label">추천인</div>
          <input className="inp" value={form.recommender} onChange={e=>setForm(f=>({...f,recommender:e.target.value}))} placeholder="예: 바텐더 김씨" /></div>
        <div className="field"><div className="field-label">리뷰</div>
          <textarea className="inp" rows={3} value={form.review} onChange={e=>setForm(f=>({...f,review:e.target.value}))} placeholder="간단한 후기" /></div>
        <div className="field"><div className="field-label">추천 메뉴 (쉼표 구분)</div>
          <input className="inp" value={form.recMenus} onChange={e=>setForm(f=>({...f,recMenus:e.target.value}))} placeholder="예: 삼겹살, 된장찌개" /></div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setSheet(false)}>취소</button>
          <button className="btn primary" onClick={submit}>저장</button>
        </div>
      </BottomSheet>
    </div>
  )
}
