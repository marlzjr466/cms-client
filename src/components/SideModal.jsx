function SideModal ({ children, visible, title, onClose }) {
  if (!visible) {
    return null
  }

  return (
    <div className="side-modal">
      <div className="side-modal_container">
        <span className="close-button-side" onClick={onClose}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>

        <div className="title">{title}</div>

        {children}
      </div>
    </div>
  )
}

export default SideModal