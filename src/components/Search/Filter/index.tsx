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
import { getUDTTransactionsWithAddress, getSimpleUDTTransactions } from '../../../service/app/udt'
import { PageParams } from '../../../utils/const'

export enum FilterType {
  DAO,
  UDT,
}

const FILTER_COUNT = 100

const clearFilterInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const Filter = ({
  content,
  filterType = FilterType.DAO,
  typeHash,
}: {
  content?: string
  filterType?: FilterType
  typeHash?: string
}) => {
  const dispatch = useDispatch()
  const {
    nervosDaoState: { transactionsStatus },
    udtState: { filterStatus },
  } = useAppState()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return filterType === FilterType.DAO ? t('nervos_dao.dao_search_placeholder') : t('udt.search_placeholder')
  }, [t, filterType])
  const [filterValue, setFilterValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const [showReset, setShowReset] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const filterAction = (isClear?: boolean) => {
    if (isClear) {
      setShowClear(false)
      clearFilterInput(inputElement)
    }
  }

  const resetFilterAction = () => {
    setShowReset(false)
    setShowClear(false)
    clearFilterInput(inputElement)
    if (filterType === FilterType.DAO) {
      getNervosDaoTransactions(dispatch, 1, PageParams.PageSize)
    } else if (typeHash) {
      getSimpleUDTTransactions(typeHash, 1, PageParams.PageSize, dispatch)
    }
  }

  const FilterIcon = ({ isClear }: { isClear?: boolean }) => {
    return (
      <FilterImage isClear={isClear} onClick={() => filterAction(isClear)}>
        <img src={isClear ? ClearLogo : SearchFilter} alt="search logo" />
      </FilterImage>
    )
  }

  const ResetFilter = () => {
    return <ResetButtonPanel onClick={() => resetFilterAction()}>{i18n.t('nervos_dao.dao_search_reset')}</ResetButtonPanel>
  }

  const handleSearchResult = () => {
    const query = filterValue.trim().replace(',', '') // remove front and end blank and ','
    if (!query || containSpecialChar(query)) {
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: true,
        },
      })
    } else {
      if (filterType === FilterType.DAO) {
        searchNervosDaoTransactions(query, dispatch)
      } else if (typeHash) {
        getUDTTransactionsWithAddress(query, typeHash, 1, FILTER_COUNT, dispatch)
      }
    }
  }

  useEffect(() => {
    if (filterType === FilterType.DAO) {
      if (transactionsStatus === 'OK') {
        setShowReset(true)
      } else if (transactionsStatus === 'Error') {
        setShowReset(true)
        dispatch({
          type: ComponentActions.UpdateFilterNoResult,
          payload: {
            filterNoResult: true,
          },
        })
      }
    } else if (filterType === FilterType.UDT) {
      if (filterStatus === 'OK') {
        setShowReset(true)
      } else if (filterStatus === 'Error') {
        setShowReset(true)
        dispatch({
          type: ComponentActions.UpdateFilterNoResult,
          payload: {
            filterNoResult: true,
          },
        })
      }
    }
  }, [transactionsStatus, filterStatus, dispatch, filterType])

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
        defaultValue={filterValue || ''}
        onChange={(event: any) => {
          setFilterValue(event.target.value)
          setShowClear(!!event.target.value)
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
