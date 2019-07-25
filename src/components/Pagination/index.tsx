import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import i18n from '../../utils/i18n'

const PaginationItem = ({
  currentPage,
  total,
  pageSize,
  defaultJumpPage,
  onChange,
}: {
  currentPage: number
  total: number
  pageSize: number
  defaultJumpPage: number
  onChange: (page: number, pageSize: number) => void
}) => {
  const [inputValue, setInputValue] = useState(defaultJumpPage)
  const totalPage = Math.ceil(total / pageSize)
  const goFirstPage = () => {
    onChange(1, pageSize)
  }

  const goLastPage = () => {
    onChange(totalPage, pageSize)
  }

  const goPrev = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1, pageSize)
    }
  }

  const goNext = () => {
    if (currentPage < totalPage) {
      onChange(currentPage + 1, pageSize)
    }
  }

  const gotoPage = () => {
    if (inputValue && inputValue <= totalPage && inputValue >= 1) {
      onChange(inputValue, pageSize)
    }
  }

  const isFirstPage = () => {
    return currentPage === 1
  }

  const isLastPage = () => {
    return currentPage === totalPage
  }

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={isFirstPage()} isLastPage={isLastPage()}>
        <button type="button" className="first" onClick={() => goFirstPage()}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="left__button" onClick={() => goPrev()} />
        <div className="middle__label">{`Page ${currentPage} of ${totalPage}`}</div>
        <button type="button" className="right__button" onClick={() => goNext()} />
        <button type="button" className="last" onClick={() => goLastPage()}>
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
            if (event.target.value > 0 && event.target.value < totalPage) {
              setInputValue(event.target.value)
            } else if (event.target.value >= totalPage) {
              setInputValue(totalPage)
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              gotoPage()
            }
          }}
        />
        <button type="button" className="go__to" onClick={() => gotoPage()}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default ({
  currentPage,
  total,
  pageSize,
  onChange,
}: {
  currentPage: number
  total: number
  pageSize: number
  onChange: (page: number, pageSize: number) => void
}) => {
  return (
    <PaginationItem
      currentPage={currentPage}
      total={total}
      pageSize={pageSize}
      defaultJumpPage={1}
      onChange={onChange}
    />
  )
}
