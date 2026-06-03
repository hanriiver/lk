import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import BottomSheet from '../components/BottomSheet'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getMenus, createMenu, updateMenu, deleteMenu } from '../api/menuApi'

const BASES = ['전체','소주','맥주','와인','칵테일','막걸리','기타']
const BASE_DOT = { 소주:'dot-soju', 맥주:'dot-beer', 와인:'dot-wine', 칵테일:'dot-cocktail', 막걸리:'dot-makgeolli', 기타:'dot-other' }
const BASE_EMOJI = { 소주:'🍶', 맥주:'🍺', 와인:'🍷', 칵테일:'🍹', 막걸리:'🥛', 기타:'🥃' }

export default function Menu() {
  const nav = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems]   = useState([])
  const [base, setBase]     = useState('전체')
  const [q, setQ]           = useState('')
  const [sheet, setSheet]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState({ name:'', base:'소주', abv:'', price:'', description:'' })
  const [photo, setPhoto]   = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()
  const debounceRef = useRef(null)

  const load = async (b, query) => {
    try { setItems(await getMenus(b === '전체' ? '' : b, query)) }
    catch { toast('불러오기 실패') }
  }

  useEffect(() => { load(base, q) }, [base])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(base, q), 300)
    return () => clearTimeout(debounceRef.current)
  }, [q])

  const openAdd = () => {
    setEditing(null)
    setForm({ name:'', base:'소주', abv:'', price:'', description:'' })
    setPhoto(null); setPreview(null)
    setSheet(true)
  }

  const openEdit = (item) => {
    if (!admin) return
    setEditing(item)
    setForm({ name: item.name, base: item.base, abv: item.abv ?? '', price: item.price ?? '', description: item.description ?? '' })
    setPhoto(null)
    setPreview(item.photoUrl || null)
    setSheet(true)
  }

  const submit = async () => {
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify({
      name: form.name, base: form.base,
      abv: form.abv ? +form.abv : null,
      price: form.price ? +form.price : null,
      description: form.description || null,
    })], { type:'application/json' }))
    if (photo) fd.append('photo', photo)
    try {
      if (editing) await updateMenu(editing.id, fd)
      else         await createMenu(fd)
      setSheet(false); load(base, q); toast(editing ? '수정 완료' : '등록 완료')
    } catch (e) { console.error('저장 실패', e?.response?.status, e?.response?.data); toast('저장 실패') }
  }

  const del = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    try { await deleteMenu(id); load(base, q); toast('삭제 완료') }
    catch { toast('삭제 실패') }
  }

  const pickFile = (e) => {
    const f = e.target.files[0]; if (!f) return
    setPhoto(f); setPreview(URL.createObjectURL(f))
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
        <h1>주류 메뉴 🍺</h1>
        <div className="count">{items.length}개</div>
      </div>

      <div className="searchwrap">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="메뉴 검색" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="scroll">
        <div className="chipbar">
          {BASES.map(b => (
            <button key={b} className={`chip ${base===b?'sel':''}`} onClick={() => setBase(b)}>
              {b !== '전체' && <span className={`dot ${BASE_DOT[b]}`} />}{b}
            </button>
          ))}
        </div>

        <div style={{ padding:'12px 14px 80px' }}>
          {items.map(item => (
            <div key={item.id} className="card" onClick={() => openEdit(item)}>
              <div className="menu-card">
                {item.photoUrl
                  ? <img className="menu-thumb" src={item.photoUrl} alt="" />
                  : <div className="menu-thumb-ph">{BASE_EMOJI[item.base] || '🥃'}</div>
                }
                <div className="menu-body">
                  <div className="menu-name">{item.name}</div>
                  <div className="menu-base">{item.base}</div>
                  <div className="menu-meta">
                    {item.abv   != null && <span className="menu-abv">{item.abv}%</span>}
                    {item.price != null && <span className="menu-price">{item.price.toLocaleString()}원</span>}
                  </div>
                  {item.description && <div className="menu-desc">{item.description}</div>}
                </div>
              </div>
              {admin && <button className="del-btn" onClick={e => { e.stopPropagation(); del(item.id) }}>✕</button>}
            </div>
          ))}
        </div>
      </div>

      {admin && <button className="fab" onClick={openAdd}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg></button>}

      <BottomSheet open={sheet} onClose={() => setSheet(false)}>
        <div className="form-title">{editing ? '메뉴 수정' : '메뉴 등록'}</div>

        <div className="field">
          <div className="field-label">사진</div>
          <button className="photo-pick" onClick={() => fileRef.current.click()}>
            {preview ? <img src={preview} alt="" /> : <><span style={{fontSize:28}}>📷</span><span>사진 선택</span></>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickFile} />
        </div>

        <div className="field">
          <div className="field-label">이름 *</div>
          <input className="inp" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="메뉴 이름" />
        </div>
        <div className="field">
          <div className="field-label">카테고리 *</div>
          <select className="inp" value={form.base} onChange={e => setForm(f=>({...f,base:e.target.value}))}>
            {BASES.filter(b=>b!=='전체').map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <div style={{display:'flex',gap:10}}>
          <div className="field" style={{flex:1}}>
            <div className="field-label">도수 (%)</div>
            <input className="inp" type="number" value={form.abv} onChange={e => setForm(f=>({...f,abv:e.target.value}))} placeholder="예: 5" />
          </div>
          <div className="field" style={{flex:1}}>
            <div className="field-label">가격 (원)</div>
            <input className="inp" type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} placeholder="예: 5000" />
          </div>
        </div>
        <div className="field">
          <div className="field-label">설명</div>
          <textarea className="inp" rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="간단한 설명" />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setSheet(false)}>취소</button>
          <button className="btn primary" onClick={submit}>저장</button>
        </div>
      </BottomSheet>
    </div>
  )
}
