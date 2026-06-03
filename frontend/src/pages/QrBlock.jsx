export default function QrBlock() {
  return (
    <div style={{
      width: '100vw', height: '100dvh',
      background: '#1c1c1e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: '0 32px', textAlign: 'center',
      fontFamily: 'Pretendard Variable, Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ fontSize: 64 }}>📵</div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f5f5f7' }}>
        QR코드를 스캔해주세요
      </h2>
      <p style={{ margin: 0, fontSize: 15, color: '#98989f', lineHeight: 1.6 }}>
        테이블의 QR코드를 스캔하면<br />입장할 수 있어요
      </p>
    </div>
  )
}
