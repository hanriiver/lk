export default function BottomSheet({ open, onClose, children }) {
  return (
    <>
      <div className={`backdrop ${open ? 'on' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'on' : ''}`}>
        <div className="handle" />
        <div className="sheet-scroll">{children}</div>
      </div>
    </>
  )
}
