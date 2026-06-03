const WINDOW_MS = 10 * 60 * 1000 // 10분
const STORAGE_KEY = 'qr_access_ts'

export function initQrGate() {
  const params = new URLSearchParams(window.location.search)

  // QR로 접속한 경우 (?from=qr)
  if (params.get('from') === 'qr') {
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
    // URL에서 파라미터 제거
    window.history.replaceState({}, '', window.location.pathname)
    return true
  }

  // 이미 세션 내 접근 허가된 경우 (10분 이내)
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored) {
    const diff = Date.now() - parseInt(stored, 10)
    if (diff < WINDOW_MS) return true
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
