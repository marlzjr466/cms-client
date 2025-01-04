function Title ({ title, icon = 'fas fa-bars', size }) {

  return (
    <div className="title" style={{fontSize: size || '20px'}}>
      {
        icon && <i className={icon}></i>
      }
      {title}
    </div>
  )
}

export default Title