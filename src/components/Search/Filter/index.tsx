import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchFilter from '../../../assets/search_filter.png'
import ClearLogo from '../../../assets/clear.png'
import i18n from '../../../utils/i18n'
import { ComponentActions } from '../../../contexts/actions'
import { searchNervosDaoTransactions, getNervosDaoTransactions } from '../../../service/app/nervosDao'
import { useDispatch, useAppState } from '../../../contexts/providers'
import { FilterImage, FilterPanel, ResetButtonPanel, FilterInputPanel } from './styled'
import { containSpecialChar } from '../../../utils/string'

const clearFilterInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const setFilterInput = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  input.value = content
  input.blur()
}

const DEPOSIT_RANK_COUNT = 100

const Filter = ({ content }: { content?: string }) => {
  const dispatch = useDispatch()
  const {
    nervosDaoState: { transactionsStatus },
  } = useAppState()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return t('nervos_dao.dao_search_placeholder')
  }, [t])
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const [showReset, setShowReset] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const FilterIcon = ({ isClear }: { isClear?: boolean }) => {
    return (
      <FilterImage
        isClear={isClear}
        onClick={() => {
          if (isClear) {
            setShowClear(false)
            clearFilterInput(inputElement)
          }
        }}
      >
        <img src={isClear ? ClearLogo : SearchFilter} alt="search logo" />
      </FilterImage>
    )
  }

  const ResetFilter = () => {
    const dispatch = useDispatch()
    return (
      <ResetButtonPanel
        onClick={() => {
          setShowReset(false)
          setShowClear(false)
          clearFilterInput(inputElement)
          getNervosDaoTransactions(dispatch, 1, DEPOSIT_RANK_COUNT)
        }}
      >
        {i18n.t('nervos_dao.dao_search_reset')}
      </ResetButtonPanel>
    )
  }

  const handleSearchResult = () => {
    const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
    if (!query || containSpecialChar(query)) {
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: true,
        },
      })
    } else {
      searchNervosDaoTransactions(query, dispatch)
    }
  }

  useEffect(() => {
    if (transactionsStatus === 'InProgress') {
      setFilterInput(inputElement, i18n.t('search.loading'))
    } else if (transactionsStatus === 'OK') {
      setShowReset(true)
      setFilterInput(inputElement, searchValue)
    } else if (transactionsStatus === 'Error') {
      setFilterInput(inputElement, searchValue)
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: true,
        },
      })
    }
  }, [transactionsStatus, dispatch, searchValue])

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  return (
    <FilterPanel>
      {showReset && <ResetFilter />}
      <FilterIcon />
      <FilterInputPanel
        ref={inputElement}
        showReset={showReset}
        placeholder={placeholder}
        defaultValue={searchValue || ''}
        onChange={(event: any) => {
          setSearchValue(event.target.value)
          if (event.target.value) {
            setShowClear(true)
          }
        }}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult()
          }
        }}
      />
      {showClear && <FilterIcon isClear />}
    </FilterPanel>
  )
}

export default Filter
