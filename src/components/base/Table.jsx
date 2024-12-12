function Table () {
  return (
    <div className="table">
      <div className="table__actions">
        <button className="btn default">
          <i className="fas fa-sync"></i>
        </button>

        <div className="search-filter">
          <input type="text" placeholder="Search here..." />
          <i className="fas fa-search"></i>
        </div>

        <button className="btn info">
          <i className="fas fa-plus"></i>
        </button>

        <button className="btn danger">
          <i className="fas fa-trash"></i>
        </button>
      </div>

      <div className="table__container">
        <table>
          <thead>
            <tr>
              <th width="40px">
                <input type="checkbox" />
              </th>
              <th>id</th>
              <th>col</th>
              <th>col-2</th>
              <th>col-3</th>
            </tr>
          </thead>

          <tbody>
            {
              Array.from({ length: 15 }).map((_, i) => (
                <tr key={i}>
                  <td width="40px">
                    <input type="checkbox" />
                  </td>
                  <td>1</td>
                  <td>col</td>
                  <td>col-2</td>
                  <td>col-3</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      
      <div className="table__pagination">
        <button className="btn default">
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button className="btn default">
          <i className="fas fa-angle-left"></i>
        </button>
          
        {
          Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className={`btn default ${i === 0 ? 'active' : ''}`}
            >
              {i+1}
            </button>
          ))
        }

          {/* <button className="btn default ellipsis">
            <i className="fas fa-ellipsis-h"></i>
          </button> */}
        
        <button className="btn default">
          <i className="fas fa-angle-right"></i>
        </button>
        <button className="btn default">
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Table