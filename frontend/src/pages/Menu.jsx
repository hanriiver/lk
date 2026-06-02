import { useEffect, useState, useRef } from 'react'
import StatusBar from '../components/StatusBar'
import BottomSheet from '../components/BottomSheet'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getMenus, createMenu, updateMenu, deleteMenu } from '../api/menuApi'

const BASES = [
  { key: '위스키', color: '#b4763a', tint: '#f6ecdf' },
  { key: '진',     color: '#2f9e7e', tint: '#e2f4ee' },
  { key: '럼',     color: '#e0832f', tint: '#fbeede' },
  { key: '보드카', color: '#3a82e8', tint: '#e6f0fd' },
  { key: '데킬라', color: '#7aa42f', tint: '#eef5e0' },
  { key: '브랜디', color: '#c0492f', tint: '#f9e7e2' },
  { key: '리큐르', color: '#8a5cd0', tint: '#efe8fa' },
  { key: '기타',   color: '#8e8e93', tint: '#eeeef0' },
]
const baseMap = Object.fromEntries(BASES.map(b => [b.key, b]))

function fmtAbv(a) { const n = parseFloat(a); return isNaN(n) ? '' : n + '%' }
function fmtPrice(p) { const n = parseFloat(p); return isNaN(n) ? '' : n.toLocaleString('ko-KR') }

export default function Menu() {
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('전체')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // form state
  const [fName, setFName] = useState('')
  const [fBase, setFBase] = useState(null)
  const [fAbv, setFAbv] = useState('')
  const [fPrice, setFPrice] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fPhoto, setFPhoto] = useState(null)
  const [fPhotoFile, setFPhotoFile] = useState(null)
  const photoRef = useRef()

  const load = () => getMenus(filter === '전체' ? undefined : filter, q || undefined).then(setItems).catch(() => toast('불러오기 실패'))

  useEffect(() => { load() }, [filter, q])

  const openForm = (item) => {
    setEditing(item || null)
    setFName(item?.name || '')
    setFBase(item?.base || null)
    setFAbv(item?.abv ?? '')
    setFPrice(item?.price ?? '')
    setFDesc(item?.description || '')
    setFPhoto(item?.photoUrl || null)
    setFPhotoFile(null)
    setFormOpen(true)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return
    setFPhotoFile(file)
    setFPhoto(URL.createObjectURL(file))
    e.target.value = ''
  }

  const save = async () => {
    if (!fName.trim()) { toast('메뉴 이름을 입력하세요'); return }
    if (!fBase) { toast('카테고리를 선택하세요'); return }
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify({ name: fName, base: fBase, abv: fAbv === '' ? null : parseFloat(fAbv), price: fPrice === '' ? null : parseInt(fPrice), description: fDesc })], { type: 'application/json' }))
    if (fPhotoFile) fd.append('photo', fPhotoFile)
    try {
      if (editing) { await updateMenu(editing.id, fd); toast('수정되었어요') }
      else { await createMenu(fd); toast('메뉴가 추가되었어요') }
      setFormOpen(false); load()
    } catch { toast('저장 실패') }
  }

  const remove = async () => {
    if (!editing) return
    try { await deleteMenu(editing.id); toast('삭제되었어요'); setFormOpen(false); load() }
    catch { toast('삭제 실패') }
  }

  const shown = filter === '전체' ? items : items.filter(i => i.base === filter)

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll">
        <div className="lhead">
          <div className="toprow">
            <h1>메뉴판</h1>
            <LockButton />
          </div>
          <div className="count">전체 {items.length}개 메뉴{admin ? ' · 관리자 모드' : ''}</div>
        </div>

        <div className="searchwrap">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <input placeholder="메뉴 검색" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div className="chipbar">
          {['전체', ...BASES.map(b => b.key)].map(k => {
            const b = baseMap[k]
            const cnt = k === '전체' ? items.length : items.filter(i => i.base === k).length
            if (k !== '전체' && cnt === 0 && filter !== k) return null
            return (
              <div key={k} className={`chip ${filter === k ? 'sel' : ''}`} onClick={() => setFilter(k)}>
                {k !== '전체' && <span className="dot" style={{ background: b.color }} />}
                {k}{k !== '전체' && <span style={{ opacity: .5 }}>{cnt}</span>}
              </div>
            )
          })}
        </div>

        <div style={{ padding: '10px 16px 120px' }}>
          {shown.length === 0 ? (
            <div className="empty"><span className="e-ic">🥃</span>{q ? '검색 결과가 없어요.' : '아직 등록된 메뉴가 없어요.'}</div>
          ) : (filter === '전체' ? BASES : []).reduce((acc, b) => {
            const arr = shown.filter(i => i.base === b.key)
            if (!arr.length) return acc
            return [...acc, <div key={b.key} style={{ fontSize: 14, fontWeight: 700, color: 'var(--sub2)', margin: '16px 4px 9px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: b.color, display: 'inline-block' }} />{b.key}</div>, ...arr.map(it => <MenuCard key={it.id} item={it} admin={admin} onOpen={() => setDetail(it)} onEdit={() => openForm(it)} />)]
          }, filter !== '전체' ? shown.map(it => <MenuCard key={it.id} item={it} admin={admin} onOpen={() => setDetail(it)} onEdit={() => openForm(it)} />) : [])}
        </div>
      </div>

      {admin && (
        <button className="fab accent" onClick={() => openForm(null)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </button>
      )}

      {/* Detail sheet */}
      <BottomSheet open={!!detail} onClose={() => setDetail(null)}>
        {detail && (() => {
          const c = baseMap[detail.base] || baseMap['기타']
          return <>
            <div style={{ width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', margin: '6px 0 16px', background: c.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {detail.photoUrl ? <img src={detail.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 60 }}>🥃</span>}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{detail.name}</div>
            <div style={{ display: 'flex', gap: 8, margin: '12px 0 16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, padding: '5px 11px', borderRadius: 9, background: c.tint, color: c.color }}>{detail.base}</span>
              {detail.abv != null && <span style={{ fontSize: 13, fontWeight: 700, padding: '5px 11px', borderRadius: 9, background: 'var(--field)', color: 'var(--sub2)' }}>도수 {fmtAbv(detail.abv)}</span>}
              {detail.price != null && <span style={{ fontSize: 13, fontWeight: 700, padding: '5px 11px', borderRadius: 9, background: 'var(--field)', color: 'var(--sub2)' }}>{fmtPrice(detail.price)}원</span>}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{detail.description || '설명이 없어요.'}</div>
            {admin && <div className="actions" style={{ marginTop: 22 }}><button className="btn ghost" onClick={() => { setDetail(null); openForm(detail) }}>수정</button></div>}
          </>
        })()}
      </BottomSheet>

      {/* Form sheet */}
      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)}>
        <div className="form-title">{editing ? '메뉴 수정' : '메뉴 추가'}</div>
        <div onClick={() => photoRef.current.click()} style={{ width: 130, height: 130, borderRadius: 18, margin: '0 auto 18px', cursor: 'pointer', background: 'var(--field)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', position: 'relative', border: '1.5px dashed rgba(255,255,255,.22)' }}>
          {fPhoto ? <img src={fPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="#8e8e93" strokeWidth="1.6"/><circle cx="8.5" cy="11" r="1.8" fill="#8e8e93"/><path d="M4 18l5-4 3 2.5L16 12l4 4" stroke="#8e8e93" strokeWidth="1.6" fill="none"/></svg><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>사진 추가</span></>}
          {fPhoto && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, fontWeight: 600, padding: 5, textAlign: 'center' }}>사진 변경</div>}
        </div>
        <input type="file" ref={photoRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        <div className="field"><div className="field-label">메뉴 이름</div><input className="inp" value={fName} onChange={e => setFName(e.target.value)} placeholder="예: 발베니 더블우드 12년" /></div>
        <div className="field">
          <div className="field-label">베이스 카테고리</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BASES.map(b => (
              <div key={b.key} onClick={() => setFBase(b.key)} style={{ padding: '8px 13px', borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', background: fBase === b.key ? b.color : 'var(--card)', border: `1px solid ${fBase === b.key ? 'transparent' : 'var(--hair)'}`, color: fBase === b.key ? '#fff' : 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: fBase === b.key ? '#fff' : b.color, display: 'inline-block' }} />{b.key}
              </div>
            ))}
          </div>
        </div>
        <div className="field"><div className="field-label">도수</div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><input className="inp" type="number" style={{ width: 110 }} value={fAbv} onChange={e => setFAbv(e.target.value)} placeholder="40" /><span style={{ color: 'var(--sub2)' }}>도 (%)</span></div></div>
        <div className="field"><div className="field-label">가격</div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><input className="inp" type="number" style={{ width: 150 }} value={fPrice} onChange={e => setFPrice(e.target.value)} placeholder="15000" /><span style={{ color: 'var(--sub2)' }}>원</span></div></div>
        <div className="field"><div className="field-label">메뉴 설명</div><textarea className="inp" rows={4} value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="맛, 향, 추천 포인트 등을 적어주세요." /></div>
        <div className="actions">
          {editing && <button className="btn danger" onClick={remove}>삭제</button>}
          <button className="btn ghost" onClick={() => setFormOpen(false)}>취소</button>
          <button className="btn accent" onClick={save}>저장</button>
        </div>
      </BottomSheet>
    </div>
  )
}

function MenuCard({ item, admin, onOpen, onEdit }) {
  const c = baseMap[item.base] || baseMap['기타']
  return (
    <div className="card" style={{ display: 'flex', gap: 12, padding: 11, alignItems: 'stretch', borderRadius: 16, marginBottom: 10 }} onClick={onOpen}>
      <div style={{ width: 78, height: 78, borderRadius: 12, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.tint }}>
        {item.photoUrl ? <img src={item.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>🥃</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
          {item.abv != null && <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: 'var(--field)', color: 'var(--sub2)' }}>{item.abv}%</span>}
        </div>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, marginTop: 5, background: c.tint, color: c.color }}>{item.base}</span>
        {item.description && <div style={{ fontSize: 13, color: 'var(--sub2)', lineHeight: 1.45, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</div>}
        {item.price != null && <div style={{ fontSize: 15, fontWeight: 700, marginTop: 7 }}>{item.price.toLocaleString('ko-KR')}<span style={{ fontSize: 12, color: 'var(--sub2)', marginLeft: 1 }}>원</span></div>}
      </div>
      {admin && (
        <button onClick={e => { e.stopPropagation(); onEdit() }} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(120,120,128,.16)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sub2)', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L19 9l-4-4L4 16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
        </button>
      )}
    </div>
  )
}
