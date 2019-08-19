import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'

const Pagination = ({
  currentPage,
  totalPages,
  gotoPage = currentPage + 1,
  onChange,
}: {
  currentPage: number
  totalPages: number
  gotoPage?: number
  onChange: (page: number) => void
}) => {
  const [inputPage, setInputPage] = useState(gotoPage)
  const total = Math.max(totalPages, 1)
  const current = Math.min(Math.max(currentPage, 1), totalPages)
  const changePage = (page: number) => {
    if (page && page >= 1 && page <= total) {
      onChange(page)
      setInputPage(Math.min(page + 1, totalPages))
    }
  }

  const MobilePagination = `${i18n.t('pagination.total_page')} ${total} ${i18n.t('pagination.end_page')}`
  const PCPagination = `${i18n.t('pagination.current_page')} ${current} ${i18n.t(
    'pagination.of_page',
  )} ${total} ${i18n.t('pagination.end_page')}`

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={current === 1} isLastPage={current === total}>
        <button type="button" className="first" onClick={() => changePage(1)}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="left__button" onClick={() => changePage(current - 1)} />
        <div className="middle__label">{isMobile() ? MobilePagination : PCPagination}</div>
        <button type="button" className="right__button" onClick={() => changePage(current + 1)} />
        <button type="button" className="last" onClick={() => changePage(total)}>
          {i18n.t('pagination.last')}
        </button>
      </PaginationLeftItem>
      <PaginationRightItem>
        <div className="page">{i18n.t('pagination.page')}</div>
        <input
          type="text"
          pattern="[0-9]*"
          className="input__page"
          value={inputPage}
          onChange={(event: any) => {
            const pageNo: number = parseInt(event.target.value, 10)
            if (Number.isNaN(pageNo)) {
              setInputPage(event.target.value)
            } else {
              setInputPage(Math.min(pageNo, total))
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              changePage(inputPage)
            }
          }}
        />
        <button type="button" className="goto__page" onClick={() => changePage(inputPage)}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default Pagination
