import { useState, useEffect, useRef } from 'react'
import moment from 'moment'

// components
import NoData from '@components/base/NoData'
import Loading from '@components/base/Loading'

// utils
import { formatWithCurrency } from '@utilities/helper'

function Table({
  headers = [],
  rows = [],
  selectedValue: key,
  totalRowsCount,
  disableButton,
  isLoading,
  actions,
  countPerPage = 10,
  noDelete,
  onSelect = () => {},
  onRowClick = () => {},
  onPageChance = () => {},
  onCreate = () => {},
  onRefresh = () => {},
  onDelete = () => {},
  onSearch = () => {}
}) {
  const totalPages = Math.ceil(totalRowsCount / countPerPage) // Total pages based on the row count
  const maxVisiblePages = 5 // Maximum number of page buttons to show at once

  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const searchFormRef = useRef(null) 

  useEffect(() => onSelect(selectedRows), [selectedRows])
  useEffect(() => onPageChance(currentPage), [currentPage])

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(rows.map((row, i) => (key ? row[key] : i)))
    }
  }

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const getPageRows = () => {
    const startIndex = (currentPage - 1) * countPerPage
    return rows.slice(startIndex, startIndex + countPerPage)
  }

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
    const value = keys.map(key => {
      if (key.includes('.')) {
        return key.split('.').reduce((obj, key) => obj?.[key], row)
      }

      return row[key]
    }).join(' ')

    return value
  }

  const handleSearch = e => {
    e.preventDefault()
    onSearch(e.target.children[0].value)
  }

  const objectKey = (row, headerKey) => {
    let result = headerKey.split('.').reduce((obj, key) => obj?.[key], row)

    if (headerKey.includes('_at') || headerKey.includes('_date')) {
      result = result ? moment(result).format('MMM DD, YYYY') : '---'
    }

    return result
  }

  return (
    <div className="table">
      <div className="table__actions">
        <button
          className="btn default"
          onClick={() => {
            onRefresh()
            searchFormRef.current.reset()
          }}
        >
          <i className="fas fa-sync"></i>
        </button>

        <form
          ref={searchFormRef}
          className="search-filter"
          onSubmit={handleSearch}
        >
          <input type="text" name="search" placeholder="Search here..." />
          <button className="btn ghost negative" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        {
          !disableButton && (
            <>
              <button className="btn info" onClick={onCreate}>
                <i className="fas fa-plus"></i>
              </button>

              {
                !noDelete && (
                  <button
                    className={`btn danger ${!selectedRows.length ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!selectedRows.length) {
                        return null
                      }

                      onDelete(
                        selectedRows,
                        () => setSelectedRows([]) // reset selected rows
                      )
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )
              }
            </>
          )
        }
      </div>

      <div className="table__container">
        <table>
          <thead>
            <tr>
              {
                !disableButton && !noDelete && (
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

              {
                actions && (
                  <th>Actions</th>
                )
              }
            </tr>
          </thead>

          <tbody>
            {getPageRows().map((row, i) => (
              <tr key={row.id}>
                {
                  !disableButton && !noDelete && (
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
                  <td
                    key={index}
                    onClick={() => onRowClick(row)}
                    className={`
                      ${header.key === 'description' ? 'truncate' : ''}
                    `}
                  >
                    {
                      typeof header.key === 'object'
                        ? combineKeys(header.key, row)
                        : header.key.includes('.')
                          ? objectKey(row, header.key)
                          : header.key.includes('_at') || header.key.includes('_date')
                            ? moment(row[header.key]).format('MMM DD, YYYY')
                            : ['price', 'amount'].includes(header.key)
                              ? formatWithCurrency(row[header.key])
                              : row[header.key] || '-'
                    }
                  </td>
                ))}

                {
                  actions ? (
                    <td className="flex gap-2">
                      {
                        actions.map((item, index) => (
                          <button
                            key={index}
                            className="btn info"
                            style={{ padding: 8 }}
                            onClick={e => {
                              e.stopPropagation()
                              item.onAction(row)
                            }}
                          >
                            {item.label}
                          </button>
                        ))
                      }
                    </td>
                  ) : null
                }
              </tr>
            ))}

            {!rows.length && (
              <tr className="nodata">
                <td colSpan={!disableButton && !noDelete ? headers.length + 1 : headers.length} style={{ textAlign: 'center' }}>
                  <NoData />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {
          isLoading && (
            <div className="table__loader">
              <Loading auto size={30} thick={4} />
            </div>
          )
        }
      </div>

      {rows.length && !isLoading ? (
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
