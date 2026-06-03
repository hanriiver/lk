const WINDOW_MS = 10 * 60 * 1000 // 10분

// QR URL의 ?t= 값이 현재 시각 기준 10분 이내인지 확인
function isTokenValid(t) {
  const ts = parseInt(t, 10)
  if (isNaN(ts)) return false
  const diff = Date.now() - ts * 1000
  return diff >= 0 && diff < WINDOW_MS
}

const STORAGE_KEY = 'qr_access_ts'

export function initQrGate() {
  const params = new URLSearchParams(window.location.search)
  const t = params.get('t')

  if (t && isTokenValid(t)) {
    // 유효한 QR 토큰 — 접속 시간 저장
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
    // URL에서 ?t= 제거 (깔끔하게)
    const url = new URL(window.location.href)
    url.searchParams.delete('t')
    window.history.replaceState({}, '', url.toString())
    return true
  }

  // 이미 세션 내 접근 허가된 경우 (10분 이내)
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored) {
    const diff = Date.now() - parseInt(stored, 10)
    if (diff < WINDOW_MS) return true
    // 만료 — 세션 삭제
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return false
}

export function getRemainingMs() {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  const diff = Date.now() - parseInt(stored, 10)
  return Math.max(0, WINDOW_MS - diff)
}
