import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CATS = [
  { key: '맥주',   color: '#f0a500', bg: 'rgba(240,165,0,.12)'   },
  { key: '칵테일', color: '#e05c8a', bg: 'rgba(224,92,138,.12)'  },
  { key: '위스키', color: '#c17f3e', bg: 'rgba(193,127,62,.12)'  },
  { key: '논알콜', color: '#4caf7d', bg: 'rgba(76,175,125,.12)'  },
  { key: '안주',   color: '#7b8ce8', bg: 'rgba(123,140,232,.12)' },
]

const COCKTAIL_SUBS = [
  { key: '진',     folder: 'gin'     },
  { key: '보드카', folder: 'vodka'   },
  { key: '테킬라', folder: 'tequila' },
  { key: '럼',     folder: 'rum'     },
  { key: '위스키', folder: 'whiskey' },
  { key: '리큐르', folder: 'liqueur' },
  { key: '고도수', folder: 'strong'  },
]

const IMAGES = {
  맥주: [
    '/menus/beer/1.png',
    '/menus/beer/2.png',
  ],
  위스키: [],
  안주: [],
  논알콜: [
    '/menus/nonalcohol/28.png',
    '/menus/nonalcohol/29.png',
    '/menus/nonalcohol/30.png',
  ],
}

const COCKTAIL_IMAGES = {
  gin:     [3,4,5,6,7,8].map(n => `/menus/cocktail/gin/${n}.png`),
  vodka:   [9,10,11].map(n => `/menus/cocktail/vodka/${n}.png`),
  rum:     [12,13,14,15].map(n => `/menus/cocktail/rum/${n}.png`),
  tequila: [16,17,18].map(n => `/menus/cocktail/tequila/${n}.png`),
  whiskey: [19,20,21].map(n => `/menus/cocktail/whiskey/${n}.png`),
  liqueur: [22,23,24].map(n => `/menus/cocktail/liqueur/${n}.png`),
  strong:  [25,26,27].map(n => `/menus/cocktail/strong/${n}.png`),
}

export default function Menu() {
  const nav = useNavigate()
  const [cat, setCat] = useState('맥주')
  const [cocktailSub, setCocktailSub] = useState('gin')
  const scrollRef = useRef(null)

  const activeCat = CATS.find(c => c.key === cat)

  const getImages = () => {
    if (cat === '칵테일') return COCKTAIL_IMAGES[cocktailSub] ?? []
    return IMAGES[cat] ?? []
  }
  const images = getImages()

  const changeCat = (key) => {
    setCat(key)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  const changeSub = (folder) => {
    setCocktailSub(folder)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

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

      {/* 메인 카테고리 칩 */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '9px 14px',
        borderBottom: cat === '칵테일' ? 'none' : '0.5px solid var(--hair)',
        background: 'rgba(28,28,30,.98)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        scrollbarWidth: 'none',
        position: 'relative', zIndex: 20,
        flexShrink: 0,
      }}>
        {CATS.map(c => {
          const sel = cat === c.key
          return (
            <button
              key={c.key}
              onClick={() => changeCat(c.key)}
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

      {/* 칵테일 세부 카테고리 칩 */}
      {cat === '칵테일' && (
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto',
          padding: '7px 14px', borderBottom: '0.5px solid var(--hair)',
          background: 'rgba(28,28,30,.98)',
          scrollbarWidth: 'none',
          position: 'relative', zIndex: 20,
          flexShrink: 0,
        }}>
          {COCKTAIL_SUBS.map(s => {
            const sel = cocktailSub === s.folder
            return (
              <button
                key={s.folder}
                onClick={() => changeSub(s.folder)}
                style={{
                  flexShrink: 0, padding: '5px 13px', borderRadius: 14,
                  border: `1px solid ${sel ? activeCat.color : 'rgba(255,255,255,.08)'}`,
                  background: sel ? activeCat.bg : 'transparent',
                  color: sel ? activeCat.color : 'var(--sub)',
                  fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font)', transition: 'all .15s',
                }}
              >
                {s.key}
              </button>
            )
          })}
        </div>
      )}

      {/* 이미지 리스트 */}
      <div className="scroll" ref={scrollRef}>
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
          <div style={{ padding: '12px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
