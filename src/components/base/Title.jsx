function Title ({ title, icon = 'fas fa-bars' }) {

  return (
    <div className="title">
      <i className={icon}></i>
      {title}
    </div>
  )
}

export default Title