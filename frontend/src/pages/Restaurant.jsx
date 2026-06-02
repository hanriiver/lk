import { useEffect, useState } from 'react'
import StatusBar from '../components/StatusBar'
import BottomSheet from '../components/BottomSheet'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../api/restaurantApi'

const CATS = [
  { key: '한식',     color: '#e0832f' },
  { key: '일식',     color: '#2f8df0' },
  { key: '중식',     color: '#c0492f' },
  { key: '양식',     color: '#8a5cd0' },
  { key: '아시안',   color: '#2f9e7e' },
  { key: '카페·디저트', color: '#c879a0' },
  { key: '술집·바',  color: '#fe5071' },
  { key: '기타',     color: '#8e8e93' },
]
const catMap = Object.fromEntries(CATS.map(c => [c.key, c]))

export default function Restaurant() {
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('전체')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [fName, setFName] = useState('')
  const [fCat, setFCat] = useState(null)
  const [fLoc, setFLoc] = useState('')
  const [fBy, setFBy] = useState('')
  const [fReview, setFReview] = useState('')
  const [fRec, setFRec] = useState('')

  const load = () => getRestaurants(filter === '전체' ? undefined : filter, q || undefined).then(setItems).catch(() => toast('불러오기 실패'))

  useEffect(() => { load() }, [filter, q])

  const openForm = (item) => {
    setEditing(item || null)
    setFName(item?.name || '')
    setFCat(item?.category || null)
    setFLoc(item?.location || '')
    setFBy(item?.recommender || '')
    setFReview(item?.review || '')
    setFRec(item?.recMenus?.join(', ') || '')
    setFormOpen(true)
  }

  const save = async () => {
    if (!fName.trim()) { toast('가게 이름을 입력하세요'); return }
    if (!fCat) { toast('카테고리를 선택하세요'); return }
    const data = {
      name: fName, category: fCat, location: fLoc || null,
      recommender: fBy || null, review: fReview || null,
      recMenus: fRec ? fRec.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    try {
      if (editing) { await updateRestaurant(editing.id, data); toast('수정되었어요') }
      else { await createRestaurant(data); toast('맛집이 추가되었어요') }
      setFormOpen(false); load()
    } catch { toast('저장 실패') }
  }

  const remove = async () => {
    try { await deleteRestaurant(editing.id); toast('삭제되었어요'); setFormOpen(false); load() }
    catch { toast('삭제 실패') }
  }

  const shown = filter === '전체' ? items : items.filter(i => i.category === filter)

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll">
        <div className="lhead">
          <div className="toprow">
            <h1>나만의 맛집</h1>
            <LockButton colorClass="food" />
          </div>
          <div className="count">맛집 {items.length}곳{admin ? ' · 관리자 모드' : ''}</div>
        </div>
        <p style={{ margin: '2px 20px 6px', fontSize: 13, color: 'var(--sub2)', lineHeight: 1.5 }}>
          다녀온 맛집을 자유롭게 등록해 주세요. 카드를 눌러 지도로 바로 찾아가세요 🍴
        </p>

        <div className="searchwrap">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <input placeholder="가게 이름·지역 검색" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div className="chipbar">
          {['전체', ...CATS.map(c => c.key)].map(k => {
            const c = catMap[k]
            const cnt = k === '전체' ? items.length : items.filter(i => i.category === k).length
            if (k !== '전체' && cnt === 0 && filter !== k) return null
            return (
              <div key={k} className={`chip ${filter === k ? 'sel' : ''}`} onClick={() => setFilter(k)}>
                {k !== '전체' && <span className="dot" style={{ background: c.color }} />}
                {k}{k !== '전체' && <span style={{ opacity: .5 }}>{cnt}</span>}
              </div>
            )
          })}
        </div>

        <div style={{ padding: '12px 16px 130px' }}>
          {shown.length === 0 ? (
            <div className="empty"><span className="e-ic">🍽️</span>{q ? '검색 결과가 없어요.' : '아직 등록된 맛집이 없어요.'}</div>
          ) : shown.map(it => {
            const c = catMap[it.category] || catMap['기타']
            const recs = (it.recMenus || []).slice(0, 4)
            return (
              <div key={it.id} className="card" onClick={() => setDetail(it)}>
                {admin && (
                  <button onClick={e => { e.stopPropagation(); openForm(it) }} style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', background: 'rgba(120,120,128,.16)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sub2)', cursor: 'pointer', zIndex: 3 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L19 9l-4-4L4 16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
                  </button>
                )}
                <div style={{ padding: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: c.color + '1f', color: c.color }}>{it.category}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{it.name}</div>
                  {it.recommender && <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>🙋 {it.recommender}님 추천</div>}
                  {it.review && <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5, marginTop: 9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.review}</div>}
                  {recs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                      {recs.map(r => <span key={r} style={{ fontSize: 12, fontWeight: 600, color: '#ff8a5c', background: 'rgba(254,80,0,.16)', padding: '4px 9px', borderRadius: 7 }}>{r}</span>)}
                    </div>
                  )}
                  <div className="map-row">
                    <button className="map-btn naver" onClick={e => { e.stopPropagation(); window.open('https://map.naver.com/p/search/' + encodeURIComponent(it.name), '_blank') }}>
                      네이버 지도에서 보기
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {admin && (
        <button className="fab" onClick={() => openForm(null)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </button>
      )}

      {/* Detail sheet */}
      <BottomSheet open={!!detail} onClose={() => setDetail(null)}>
        {detail && (() => {
          const c = catMap[detail.category] || catMap['기타']
          return <>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.4px' }}>{detail.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, padding: '5px 11px', borderRadius: 9, background: c.color, color: '#fff' }}>{detail.category}</span>
            </div>
            {detail.recommender && <div style={{ fontSize: 14, color: 'var(--sub2)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>🙋 {detail.recommender}님 추천</div>}
            {detail.review && <div style={{ fontSize: 15, lineHeight: 1.65, marginTop: 16, whiteSpace: 'pre-wrap' }}>{detail.review}</div>}
            {detail.recMenus?.length > 0 && <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sub2)', margin: '18px 0 8px' }}>추천 메뉴</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{detail.recMenus.map(r => <span key={r} style={{ fontSize: 12, fontWeight: 600, color: '#ff8a5c', background: 'rgba(254,80,0,.16)', padding: '4px 9px', borderRadius: 7 }}>{r}</span>)}</div>
            </>}
            <div className="map-row" style={{ marginTop: 22 }}>
              <button className="map-btn naver" onClick={() => window.open('https://map.naver.com/p/search/' + encodeURIComponent(detail.name), '_blank')}>네이버 지도에서 보기</button>
            </div>
            {admin && <div className="actions" style={{ marginTop: 14 }}><button className="btn ghost" onClick={() => { setDetail(null); openForm(detail) }}>수정</button></div>}
          </>
        })()}
      </BottomSheet>

      {/* Form sheet */}
      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)}>
        <div className="form-title">{editing ? '맛집 수정' : '맛집 추가'}</div>
        <div className="field"><div className="field-label">가게 이름</div><input className="inp" placeholder="예: 레몬과 김부각" value={fName} onChange={e => setFName(e.target.value)} /></div>
        <div className="field"><div className="field-label">추천하는 분 (닉네임)</div><input className="inp" placeholder="예: 민지 (선택)" maxLength={20} value={fBy} onChange={e => setFBy(e.target.value)} /></div>
        <div className="field">
          <div className="field-label">카테고리</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATS.map(c => (
              <div key={c.key} onClick={() => setFCat(c.key)} style={{ padding: '8px 13px', borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', background: fCat === c.key ? c.color : 'var(--card)', border: `1px solid ${fCat === c.key ? 'transparent' : 'var(--hair)'}`, color: fCat === c.key ? '#fff' : 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: fCat === c.key ? '#fff' : c.color, display: 'inline-block' }} />{c.key}
              </div>
            ))}
          </div>
        </div>
        <div className="field"><div className="field-label">지역</div><input className="inp" placeholder="예: 마포구 망원동" value={fLoc} onChange={e => setFLoc(e.target.value)} /></div>
        <div className="field"><div className="field-label">추천 메뉴 (쉼표로 구분)</div><input className="inp" placeholder="예: 트러플 파스타, 티라미수" value={fRec} onChange={e => setFRec(e.target.value)} /></div>
        <div className="field"><div className="field-label">한줄평 · 추천 이유</div><textarea className="inp" rows={4} placeholder="왜 이 집을 추천하는지 적어주세요." value={fReview} onChange={e => setFReview(e.target.value)} /></div>
        <div className="actions">
          {editing && <button className="btn danger" onClick={remove}>삭제</button>}
          <button className="btn ghost" onClick={() => setFormOpen(false)}>취소</button>
          <button className="btn primary" onClick={save}>저장</button>
        </div>
      </BottomSheet>
    </div>
  )
}
