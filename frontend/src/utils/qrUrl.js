const BASE = 'https://lk-bice.vercel.app'

// 현재 시각(초) 기준 QR URL 생성
export function generateQrUrl() {
  const t = Math.floor(Date.now() / 1000)
  return `${BASE}?t=${t}`
}
