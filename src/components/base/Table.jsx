import { useState, useEffect } from 'react';

// components
import NoData from '@components/base/NoData';
import Loading from '@components/base/Loading';

function Table({
  headers = [],
  rows = [],
  selectedValue: key,
  onSelect,
  isLoading,
  onRowClick,
  totalRowsCount,
  onPageChance,
  disableButton
}) {
  const countPerPage = 15; // Number of rows per page
  const totalPages = Math.ceil(totalRowsCount / countPerPage); // Total pages based on the row count
  const maxVisiblePages = 5; // Maximum number of page buttons to show at once

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => onSelect(selectedRows), [selectedRows])
  useEffect(() => onPageChance(currentPage), [currentPage])

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row, i) => (key ? row[key] : i)));
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getPageRows = () => {
    const startIndex = (currentPage - 1) * countPerPage;
    return rows.slice(startIndex, startIndex + countPerPage);
  };

  const getPaginationRange = () => {
    // Total pages are less than or equal to maxVisiblePages, show all pages
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    // Determine the range of visible pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
  
    // Adjust the range if at the end of the pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
  
    // Return the range of pages to display
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const combineKeys = (keys, row) => {
    const value = keys.map(key => row[key]).join(' ')

    return value
  }

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

        {
          !disableButton && (
            <>
              <button className="btn info">
                <i className="fas fa-plus"></i>
              </button>

              <button className="btn danger">
                <i className="fas fa-trash"></i>
              </button>
            </>
          )
        }
      </div>

      {isLoading ? (
        <div className="table__loader">
          <Loading auto />
        </div>
      ) : (
        <div className="table__container">
          <table>
            <thead>
              <tr>
                {
                  !disableButton && (
                    <th width="40px">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === rows.length && rows.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )
                }
                
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={['#', 'id'].includes(header.key) ? { width: '50px' } : {}}
                  >
                    {header.column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {getPageRows().map((row, i) => (
                <tr key={row.id}>
                  {
                    !disableButton && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(key ? row[key] : i)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(key ? row[key] : i);
                          }}
                        />
                      </td>
                    )
                  }
                  
                  {headers.map((header, index) => (
                    <td key={index} onClick={() => onRowClick(row)}>
                      {typeof header.key === 'object' ? combineKeys(header.key, row) : row[header.key] || ''}
                    </td>
                  ))}
                </tr>
              ))}

              {!rows.length && (
                <tr className="nodata">
                  <td colSpan={!disableButton ? headers.length + 1 : headers.length} style={{ textAlign: 'center' }}>
                    <NoData />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {rows.length ? (
        <div className="table__pagination">
          <button
            className={`btn default ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-double-left"></i>
          </button>

          <button
            className={`btn default ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-left"></i>
          </button>

          {getPaginationRange().map((page) => (
            <button
              key={page}
              className={`btn default ${page === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`btn default ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-right"></i>
          </button>

          <button
            className={`btn default ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Table;
