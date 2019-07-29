import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import i18n from '../../utils/i18n'

const Pagination = ({
  currentPage,
  totalPages,
  gotoPage = 1,
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
    if (page < 1) onChange(1)
    if (page > total) onChange(total)
    onChange(page)
  }
  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={current === 1} isLastPage={current === total}>
        <button type="button" className="first" onClick={() => changePage(1)}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="left__button" onClick={() => changePage(current - 1)} />
        <div className="middle__label">{`Page ${current} of ${total}`}</div>
        <button type="button" className="right__button" onClick={() => changePage(current + 1)} />
        <button type="button" className="last" onClick={() => changePage(total)}>
          {i18n.t('pagination.last')}
        </button>
      </PaginationLeftItem>
      <PaginationRightItem>
        <div className="page">{i18n.t('pagination.page')}</div>
        <input
          type="number"
          className="jump__page__input"
          value={inputValue}
          onChange={(event: any) => {
            if (event.target.value > 0 && event.target.value < total) {
              setInputValue(event.target.value)
            } else if (event.target.value >= total) {
              setInputValue(total)
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              changePage(inputValue)
            }
          }}
        />
        <button type="button" className="go__to" onClick={() => changePage(inputValue)}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default Pagination
