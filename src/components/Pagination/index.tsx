import React, { useState } from 'react'
import { BasePagePanel, PaginationItem, PageInput } from './styled'
import LeftBlack from '../../assets/pagination-black-left.png'
import RightBlack from '../../assets/pagination-black-right.png'
import LeftGreen from '../../assets/pagination-green-left.png'
import RightGreen from '../../assets/pagination-green-right.png'
import i18n from '../../utils/i18n'

const pageSize: number = 25

const PageFirstItem = ({
  currentPage,
  total,
  defautInput,
  onChange,
}: {
  currentPage: number
  total: number
  defautInput: string
  onChange: (page: number, pageSize: number) => void
}) => {
  const [inputValue, setInputValue] = useState(defautInput || '')

  const goFirstPage = () => {
    const page: number = 1
    onChange(page, pageSize)
  }

  const goLastPage = () => {
    onChange(total, pageSize)
  }

  const goPrev = () => {
    if (currentPage !== 1) {
      onChange(currentPage - 1, pageSize)
    }
  }

  const goNext = () => {
    if (currentPage < total) {
      onChange(currentPage + 1, pageSize)
    }
  }

  const jumpPage = () => {
    const inputValueNumber = Number(inputValue)
    if (!Number.isNaN(inputValueNumber) && inputValueNumber <= total && inputValueNumber >= 1) {
      onChange(inputValueNumber, pageSize)
    }
  }

  const isFirstPage = () => {
    return currentPage === 1
  }

  const isLastPage = () => {
    return currentPage === total
  }

  return (
    <PaginationItem isFirstPage={isFirstPage()} isLastPage={isLastPage()}>
      <button type="button" className="first" onClick={() => goFirstPage()}>
        {i18n.t('Pagination.first')}
      </button>
      <button type="button" className="leftImage" onClick={() => goPrev()}>
        <img src={isFirstPage() ? LeftBlack : LeftGreen} alt="left" />
      </button>
      <div className="middleLabel">
        Page
        {currentPage}
        of
        {total}
      </div>
      <button type="button" className="rightImage" onClick={() => goNext()}>
        <img src={isLastPage() ? RightBlack : RightGreen} alt="right" />
      </button>
      <button type="button" className="last" onClick={() => goLastPage()}>
        {i18n.t('Pagination.last')}
      </button>
      <div className="page">{i18n.t('Pagination.page')}</div>
      <PageInput
        value={inputValue}
        onChange={(event: any) => setInputValue(event.target.value)}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            jumpPage()
          }
        }}
      />
      <button type="button" className="goto" onClick={() => jumpPage()}>
        {i18n.t('Pagination.goto')}
      </button>
    </PaginationItem>
  )
}

export default ({
  currentPage,
  total,
  onChange,
}: {
  currentPage: number
  total: number
  onChange: (page: number, pageSize: number) => void
}) => {
  return (
    <BasePagePanel>
      <PageFirstItem currentPage={currentPage} total={total} defautInput="1" onChange={onChange} />
    </BasePagePanel>
  )
}
