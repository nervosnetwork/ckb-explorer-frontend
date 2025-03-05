import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useSearchParams } from '../../../hooks'
import styles from './index.module.scss'

interface PaginationProps {
  keyword?: string
  totalPages: number
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, keyword = 'page' }) => {
  const params = useSearchParams(keyword)
  const currentPage = Number(params[keyword]) || 1
  const search = new URLSearchParams(window.location.search)

  const getPageUrl = (page: number) => {
    const newSearch = new URLSearchParams(search)
    newSearch.set(keyword, page.toString())
    return `${window.location.pathname}?${newSearch.toString()}`
  }

  const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('page')
    if (!(input instanceof HTMLInputElement)) return
    const targetPage = Math.min(Math.max(1, Number(input.value)), totalPages)
    window.location.href = getPageUrl(targetPage)
  }

  return (
    <div className={styles.container}>
      <div className={styles.pager}>
        <Link to={getPageUrl(1)} aria-disabled={currentPage === 1} data-role="first-page">
          First
        </Link>
        <Link to={getPageUrl(currentPage - 1)} aria-disabled={currentPage === 1} data-role="prev-page">
          <ChevronLeftIcon width="20" height="20" />
        </Link>
        <span className={styles.pageNo}>{`Page ${currentPage} of ${totalPages}`}</span>
        <Link to={getPageUrl(currentPage + 1)} aria-disabled={currentPage === totalPages} data-role="next-page">
          <ChevronRightIcon width="20" height="20" />
        </Link>
        <Link to={getPageUrl(totalPages)} aria-disabled={currentPage === totalPages} data-role="last-page">
          Last
        </Link>
      </div>
      <form className={styles.go} onSubmit={handleGo}>
        <label htmlFor="page">Page</label>
        <input name="page" type="number" min="1" max={totalPages} defaultValue={currentPage} aria-label="Go to page" />
        <button type="submit">Goto</button>
      </form>
    </div>
  )
}

export default Pagination
