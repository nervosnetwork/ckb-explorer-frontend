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
  const [inputValue, setInputValue] = useState(gotoPage)
  const total = Math.max(totalPages, 1)
  const current = Math.min(Math.max(currentPage, 1), totalPages)
  const changePage = (page: number) => {
    if (page && page >= 1 && page <= total) {
      onChange(page)
      setInputValue(Math.min(page + 1, totalPages))
    }
  }

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={current === 1} isLastPage={current === total}>
        <button type="button" className="first" onClick={() => changePage(1)}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="left__button" onClick={() => changePage(current - 1)} />
        <div className="middle__label">{isMobile() ? `Total page ${total}` : `Page ${current} of ${total}`}</div>
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
          className="jump__page__input"
          value={inputValue}
          onChange={(event: any) => {
            if (event.target.value > 0 && event.target.value < total) {
              setInputValue(event.target.value)
            } else if (event.target.value >= total) {
              setInputValue(total)
            } else if (!event.target.value || event.target.value <= 0) {
              setInputValue(event.target.value)
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              changePage(Number(inputValue))
            }
          }}
        />
        <button type="button" className="go__to" onClick={() => changePage(Number(inputValue))}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default Pagination
