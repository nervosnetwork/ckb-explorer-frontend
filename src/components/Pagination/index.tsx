import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import LeftBlack from '../../assets/pagination_black_left.png'
import RightBlack from '../../assets/pagination_black_right.png'
import LeftGreen from '../../assets/pagination_green_left.png'
import RightGreen from '../../assets/pagination_green_right.png'
import i18n from '../../utils/i18n'

const PageFirstItem = ({
  currentPage,
  total,
  defautJumpPage,
  onChange,
}: {
  currentPage: number
  total: number
  defautJumpPage: string
  onChange: (page: number) => void
}) => {
  const [inputValue, setInputValue] = useState(defautJumpPage || '')

  const goFirstPage = () => {
    const page: number = 1
    onChange(page)
  }

  const goLastPage = () => {
    onChange(total)
  }

  const goPrev = () => {
    if (currentPage !== 1 && currentPage > 0) {
      onChange(currentPage - 1)
    }
  }

  const goNext = () => {
    if (currentPage < total) {
      onChange(currentPage + 1)
    }
  }

  const jumpPage = () => {
    const inputValueNumber = Number(inputValue)
    if (!Number.isNaN(inputValueNumber) && inputValueNumber <= total && inputValueNumber >= 1) {
      onChange(inputValueNumber)
    }
  }

  const isFirstPage = () => {
    return currentPage === 1
  }

  const isLastPage = () => {
    return currentPage === total
  }

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={isFirstPage()} isLastPage={isLastPage()}>
        <button type="button" className="first" onClick={() => goFirstPage()}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="leftimage" onClick={() => goPrev()}>
          <img src={isFirstPage() ? LeftBlack : LeftGreen} alt="left" />
        </button>
        <div className="middlelabel">
          Page
          {currentPage}
          of
          {total}
        </div>
        <button type="button" className="rightimage" onClick={() => goNext()}>
          <img src={isLastPage() ? RightBlack : RightGreen} alt="right" />
        </button>
        <button type="button" className="last" onClick={() => goLastPage()}>
          {i18n.t('pagination.last')}
        </button>
      </PaginationLeftItem>
      <PaginationRightItem>
        <button type="button" className="goto" onClick={() => jumpPage()}>
          {i18n.t('pagination.goto')}
        </button>
        <input
          value={inputValue}
          onChange={(event: any) => setInputValue(event.target.value)}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              jumpPage()
            }
          }}
        />
        <div className="page">{i18n.t('pagination.page')}</div>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default ({
  currentPage,
  total,
  onChange,
}: {
  currentPage: number
  total: number
  onChange: (page: number) => void
}) => {
  return <PageFirstItem currentPage={currentPage} total={total} defautJumpPage="1" onChange={onChange} />
}
