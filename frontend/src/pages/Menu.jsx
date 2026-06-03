import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATS = [
  { key: '맥주',   color: '#f0a500', bg: 'rgba(240,165,0,.12)'   },
  { key: '칵테일', color: '#e05c8a', bg: 'rgba(224,92,138,.12)'  },
  { key: '위스키', color: '#c17f3e', bg: 'rgba(193,127,62,.12)'  },
  { key: '논알콜', color: '#4caf7d', bg: 'rgba(76,175,125,.12)'  },
  { key: '안주',   color: '#7b8ce8', bg: 'rgba(123,140,232,.12)' },
]

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
  안주: [],
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
  const activeCat = CATS.find(c => c.key === cat)

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
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '9px 14px', borderBottom: '0.5px solid var(--hair)',
        background: 'rgba(28,28,30,.92)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        scrollbarWidth: 'none',
      }}>
        {CATS.map(c => {
          const sel = cat === c.key
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              style={{
                flexShrink: 0, padding: '7px 16px', borderRadius: 18,
                border: `1px solid ${sel ? c.color : 'rgba(255,255,255,.1)'}`,
                background: sel ? c.bg : 'var(--card)',
                color: sel ? c.color : 'var(--sub)',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font)', transition: 'all .15s',
              }}
            >
              {c.key}
            </button>
          )
        })}
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
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 18,
                  display: 'block',
                }}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
