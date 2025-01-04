function Info ({ message }) {
  return (
    <div className="info-toggle">
      <i className="fa-solid fa-info"></i>
      <div className="info-toggle__message">{message}</div>
    </div>
  )
}

export default Info