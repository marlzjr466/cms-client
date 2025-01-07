function Loading ({ size = 50, thick = 5, auto, noBackground }) {
  return (
    <div
      className="loading-container"
      style={{
        height: auto ? '100%' : '100vh',
        backgroundColor: noBackground ? 'none' : 'rgba(0,0,0,.2)'
      }}
    >
      <div
        className="loading-spinner"
        style={{
          border: `${thick}px solid #f3f3f3`,  // Light gray background
          borderTop: `${thick}px solid #3498db`,  // Blue spinner color
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  )
}

export default Loading