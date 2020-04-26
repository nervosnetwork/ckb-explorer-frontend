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

  const mobilePagination = `${i18n.t('pagination.total_page')} ${total} ${i18n.t('pagination.end_page')}`
  const pcPagination = `${i18n.t('pagination.current_page')} ${current} ${i18n.t(
    'pagination.of_page',
  )} ${total} ${i18n.t('pagination.end_page')}`

  const changePage = (page: number) => {
    if (page && page >= 1 && page <= total) {
      onChange(page)
      setInputPage(Math.min(page + 1, totalPages))
    }
  }

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={current === 1} isLastPage={current === total}>
        <button onClick={() => changePage(1)}>{i18n.t('pagination.first')}</button>
        <button type="button" className="pagination__left__button" onClick={() => changePage(current - 1)} />
        <div className="pagination__middle__label">{isMobile() ? mobilePagination : pcPagination}</div>
        <button type="button" className="pagination__right__button" onClick={() => changePage(current + 1)} />
        <button type="button" className="pagination__last" onClick={() => changePage(total)}>
          {i18n.t('pagination.last')}
        </button>
      </PaginationLeftItem>
      <PaginationRightItem>
        <div className="pagination__page">{i18n.t('pagination.page')}</div>
        <input
          type="text"
          pattern="[0-9]*"
          className="pagination__input__page"
          value={inputPage}
          onChange={(event: any) => {
            const pageNo = parseInt(event.target.value, 10)
            setInputPage(Number.isNaN(pageNo) ? event.target.value : Math.min(pageNo, total))
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              changePage(inputPage)
            }
          }}
        />
        <button type="button" className="pagination__goto__page" onClick={() => changePage(inputPage)}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default Pagination
