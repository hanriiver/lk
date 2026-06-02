import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomSheet from '../components/BottomSheet'
import LockButton from '../components/LockButton'
import { useAdmin } from '../hooks/useAdmin'
import { useToast } from '../hooks/useToast'
import { getGuestbook, createEntry, deleteEntry } from '../api/guestbookApi'

const PALETTE = ['#fe5071','#fe9e2e','#34b35a','#2f8df0','#8a5cd0','#0a84ff','#e0832f','#2f9e7e','#c0492f','#b4763a']

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function avatarColor(nick) { return PALETTE[hash(nick) % PALETTE.length] }
function initial(nick) { return (nick || '?').trim().charAt(0).toUpperCase() }
function relTime(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const MIN = 60000, H = 3600000, D = 86400000
  if (diff < MIN) return '방금 전'
  if (diff < H)   return `${Math.floor(diff/MIN)}분 전`
  if (diff < D)   return `${Math.floor(diff/H)}시간 전`
  if (diff < 7*D) return `${Math.floor(diff/D)}일 전`
  const d = new Date(ts); return `${d.getMonth()+1}월 ${d.getDate()}일`
}

export default function Guestbook() {
  const navigate = useNavigate()
  const { admin } = useAdmin()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [composeOpen, setComposeOpen] = useState(false)
  const [nick, setNick] = useState('')
  const [content, setContent] = useState('')

  const load = () => getGuestbook().then(setItems).catch(() => toast('불러오기 실패'))

  useEffect(() => { load() }, [])

  const submit = async () => {
    if (!nick.trim()) { toast('닉네임을 입력하세요'); return }
    if (!content.trim()) { toast('내용을 입력하세요'); return }
    try {
      await createEntry({ nickname: nick.trim(), content: content.trim() })
      toast('방명록이 등록되었어요 🍋')
      setComposeOpen(false)
      setNick(''); setContent('')
      load()
    } catch { toast('등록 실패') }
  }

  const remove = async (id) => {
    try { await deleteEntry(id); toast('삭제되었어요'); load() }
    catch { toast('삭제 실패') }
  }

  return (
    <div className="phone">
      <div className="island" />
      <StatusBar />

      <div className="scroll" id="scroll">
        <div className="lhead">
          <div className="toprow">
            <h1>방명록</h1>
            <LockButton />
          </div>
          <div className="count">{items.length}개의 메시지{admin ? ' · 관리자 모드' : ''}</div>
        </div>
        <p style={{ margin: '6px 20px 12px', fontSize: 13.5, color: 'var(--sub2)', lineHeight: 1.5 }}>
          다녀간 흔적을 남겨주세요. 따뜻한 한마디가 큰 힘이 돼요 🍋
        </p>

        <div style={{ padding: '4px 16px 130px' }}>
          {items.length === 0 ? (
            <div className="empty"><span className="e-ic">📖</span>아직 남겨진 글이 없어요.</div>
          ) : items.map(it => (
            <div key={it.id} style={{ background: 'var(--card)', borderRadius: 16, padding: '14px 15px', marginBottom: 11, position: 'relative' }}>
              {admin && (
                <button onClick={() => remove(it.id)} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,69,58,.22)', color: '#ff6961', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: avatarColor(it.nickname), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                  {initial(it.nickname)}
                </div>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{it.nickname}</div>
                  <div style={{ fontSize: 12, color: 'var(--sub)' }}>{relTime(it.createdAt)}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.55, marginTop: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{it.content}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="fab accent" onClick={() => setComposeOpen(true)} style={{ display: 'flex', width: 'auto', height: 54, padding: '0 22px 0 18px', borderRadius: 27, gap: 8, fontSize: 16, fontWeight: 600, fontFamily: 'var(--font)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L19 9l-4-4L4 16z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
        남기기
      </button>

      <BottomSheet open={composeOpen} onClose={() => setComposeOpen(false)}>
        <div className="form-title">방명록 남기기</div>
        <div className="field">
          <div className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>닉네임</span><span style={{ color: 'var(--sub)', fontWeight: 500 }}>{nick.length}/20</span>
          </div>
          <input className="inp" placeholder="이름 또는 별명" maxLength={20} value={nick} onChange={e => setNick(e.target.value)} />
        </div>
        <div className="field">
          <div className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>내용</span><span style={{ color: 'var(--sub)', fontWeight: 500 }}>{content.length}/300</span>
          </div>
          <textarea className="inp" rows={5} placeholder="하고 싶은 말을 남겨주세요." maxLength={300} value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setComposeOpen(false)}>취소</button>
          <button className="btn accent" onClick={submit}>남기기</button>
        </div>
      </BottomSheet>
    </div>
  )
}
