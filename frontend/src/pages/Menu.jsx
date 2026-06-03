import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATS = ['맥주', '칵테일', '위스키', '논알콜']

const IMAGES = {
  맥주: [
    '/menus/beer/1.png',
    '/menus/beer/2.png',
  ],
  칵테일: [
    '/menus/cocktail/3.png',
    '/menus/cocktail/4.png',
    '/menus/cocktail/5.png',
    '/menus/cocktail/6.png',
    '/menus/cocktail/7.png',
    '/menus/cocktail/8.png',
    '/menus/cocktail/9.png',
    '/menus/cocktail/10.png',
    '/menus/cocktail/11.png',
    '/menus/cocktail/12.png',
    '/menus/cocktail/13.png',
    '/menus/cocktail/14.png',
    '/menus/cocktail/15.png',
    '/menus/cocktail/16.png',
    '/menus/cocktail/17.png',
    '/menus/cocktail/18.png',
    '/menus/cocktail/19.png',
    '/menus/cocktail/20.png',
    '/menus/cocktail/21.png',
    '/menus/cocktail/22.png',
    '/menus/cocktail/23.png',
    '/menus/cocktail/24.png',
    '/menus/cocktail/25.png',
    '/menus/cocktail/26.png',
    '/menus/cocktail/27.png',
  ],
  위스키: [],
  논알콜: [
    '/menus/nonalcohol/28.png',
    '/menus/nonalcohol/29.png',
    '/menus/nonalcohol/30.png',
  ],
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
