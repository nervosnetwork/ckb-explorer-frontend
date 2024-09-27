import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useSearchParams } from '../../../hooks'
import styles from './index.module.scss'

interface PaginationProps {
  totalPages: number
}

const getPageUrl = (page: number, search: URLSearchParams) => {
  search.set('page', page.toString())
  return `${window.location.pathname}?${search.toString()}`
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const history = useHistory()
  const { page: p } = useSearchParams('page')

  // Get the current page from the URL query parameter, defaulting to 1 if not set
  const currentPage = Number(p) || 1
  const search = new URLSearchParams(window.location.search)

  const handleGo = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()

    const { page } = e.currentTarget
    if (!(page instanceof HTMLInputElement)) return
    const go = page.value
    if (+go < 1) {
      history.push(getPageUrl(1, search))
      return
    }
    if (+go > totalPages) {
      history.push(getPageUrl(totalPages, search))
      return
    }
    history.push(getPageUrl(+go, search))
  }

  return (
    <div className={styles.container}>
      <div className={styles.pager}>
        <Link to={getPageUrl(1, search)} aria-disabled={currentPage === 1} data-role="first-page">
          First
        </Link>
        <Link to={getPageUrl(currentPage - 1, search)} aria-disabled={currentPage === 1} data-role="prev-page">
          <ChevronLeftIcon width="20" height="20" />
        </Link>
        <span className={styles.pageNo}>{`Page ${currentPage} of ${totalPages}`}</span>
        <Link to={getPageUrl(currentPage + 1, search)} aria-disabled={currentPage === totalPages} data-role="next-page">
          <ChevronRightIcon width="20" height="20" />
        </Link>
        <Link to={getPageUrl(totalPages, search)} aria-disabled={currentPage === totalPages} data-role="last-page">
          Last
        </Link>
      </div>
      <form className={styles.go} onSubmit={handleGo}>
        <label htmlFor="page">Page</label>
        <input name="page" type="number" min="1" max={totalPages} value={currentPage} aria-label="Go to page" />
        <button type="submit">Goto</button>
      </form>
    </div>
  )
}

export default Pagination
