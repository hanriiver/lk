import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import LockButton from '../components/LockButton'
import BottomSheet from '../components/BottomSheet'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getGuestbook, createEntry, deleteEntry } from '../api/guestbookApi'

export default function Guestbook() {
  const nav = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems]   = useState([])
  const [sheet, setSheet]   = useState(false)
  const [form, setForm]     = useState({ nickname: '', content: '' })

  const load = async () => {
    try { setItems(await getGuestbook()) }
    catch { toast('불러오기 실패') }
  }

  useEffect(() => { load() }, [])

  const submit = async () => {
    if (!form.nickname.trim() || !form.content.trim()) { toast('닉네임과 내용을 입력하세요'); return }
    try {
      await createEntry(form)
      setSheet(false); setForm({ nickname:'', content:'' }); load(); toast('등록 완료')
    } catch { toast('등록 실패') }
  }

  const del = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    try { await deleteEntry(id); load(); toast('삭제 완료') }
    catch { toast('삭제 실패') }
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="lhead">
        <div className="toprow">
          <button onClick={() => nav('/')} style={{ background:'none', border:0, color:'var(--accent)', fontSize:15, cursor:'pointer', padding:0 }}>← 뒤로</button>
          <LockButton />
        </div>
        <h1>방명록 📖</h1>
        <div className="count">{items.length}개</div>
      </div>

      <div className="scroll">
        <div style={{ padding:'12px 14px 80px' }}>
          {items.map(item => (
            <div key={item.id} className="card">
              <div className="gb-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div className="gb-nick">{item.nickname}</div>
                    <div className="gb-date">{fmt(item.createdAt)}</div>
                  </div>
                  {admin && <button className="del-btn" style={{position:'static'}} onClick={() => del(item.id)}>✕</button>}
                </div>
                <div className="gb-text">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="fab accent" onClick={() => setSheet(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      <BottomSheet open={sheet} onClose={() => setSheet(false)}>
        <div className="form-title">방명록 작성</div>
        <div className="field">
          <div className="field-label">닉네임</div>
          <input className="inp" maxLength={20} value={form.nickname} onChange={e=>setForm(f=>({...f,nickname:e.target.value}))} placeholder="최대 20자" />
        </div>
        <div className="field">
          <div className="field-label">내용</div>
          <textarea className="inp" rows={4} maxLength={300} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="최대 300자" />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setSheet(false)}>취소</button>
          <button className="btn accent" onClick={submit}>등록</button>
        </div>
      </BottomSheet>
    </div>
  )
}
