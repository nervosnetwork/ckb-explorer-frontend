import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import i18n from '../../utils/i18n'

const PaginationItem = ({
  currentPage,
  totalPages,
  gotoPage,
  onChange,
}: {
  currentPage: number
  totalPages: number
  gotoPage: number
  onChange: (page: number) => void
}) => {
  const [inputValue, setInputValue] = useState(gotoPage)
  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={currentPage === 1} isLastPage={currentPage === totalPages}>
        <button type="button" className="first" onClick={() => onChange(1)}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="left__button" onClick={() => onChange(currentPage - 1)} />
        <div className="middle__label">{`Page ${currentPage} of ${totalPages}`}</div>
        <button type="button" className="right__button" onClick={() => onChange(currentPage + 1)} />
        <button type="button" className="last" onClick={() => onChange(totalPages)}>
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
            if (event.target.value > 0 && event.target.value < totalPages) {
              setInputValue(event.target.value)
            } else if (event.target.value >= totalPages) {
              setInputValue(totalPages)
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              onChange(inputValue)
            }
          }}
        />
        <button type="button" className="go__to" onClick={() => onChange(inputValue)}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default ({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}) => {
  return <PaginationItem currentPage={currentPage} totalPages={totalPages} gotoPage={1} onChange={onChange} />
}
