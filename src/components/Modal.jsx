function Modal ({ children, visible, title, onClose }) {
  if (!visible) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal_container">
        <span className="close-button" onClick={onClose}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>

        <div className="title">{title}</div>

        {children}
      </div>
    </div>
  )
}

export default Modal