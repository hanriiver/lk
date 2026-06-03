import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATS = ['맥주', '칵테일', '위스키', '논알콜']

const IMAGES = {
  맥주: [],
  칵테일: [],
  위스키: [],
  논알콜: [],
}

export default function Menu() {
  const nav = useNavigate()
  const [cat, setCat] = useState('맥주')

  const images = IMAGES[cat] ?? []

  return (
    <div className="phone">
      <div className="lhead">
        <div className="toprow">
          <button
            onClick={() => nav('/')}
            style={{ background: 'none', border: 0, color: 'var(--accent)', fontSize: 15, cursor: 'pointer', padding: 0 }}
          >
            ← 뒤로
          </button>
        </div>
        <h1>메뉴판 🍺</h1>
      </div>

      {/* 카테고리 칩 */}
      <div className="chipbar">
        {CATS.map(c => (
          <button key={c} className={`chip ${cat === c ? 'sel' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* 이미지 리스트 */}
      <div className="scroll">
        {images.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '60vh', gap: 12, color: 'var(--sub)',
          }}>
            <span style={{ fontSize: 48 }}>🍽️</span>
            <p style={{ margin: 0, fontSize: 15 }}>메뉴 이미지를 준비 중입니다</p>
          </div>
        ) : (
          <div style={{ padding: '12px 14px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {images.map((src, i) => (
              <div key={i} style={{
                width: '100%',
                height: '44vh',
                borderRadius: 18,
                overflow: 'hidden',
                background: 'var(--card)',
                flexShrink: 0,
              }}>
                <img
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
