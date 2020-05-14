import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GreenSearchLogo from '../../../assets/search_green.png'
import BlueSearchLogo from '../../../assets/search_blue.png'
import i18n from '../../../utils/i18n'
import { AppActions } from '../../../contexts/actions'
import { isMainnet } from '../../../utils/chain'
import { searchNervosDaoTransactions, getNervosDaoTransactions } from '../../../service/app/nervosDao'
import { useDispatch, useAppState } from '../../../contexts/providers'
import { DaoSearchImage, DaoSearchPanel, DaoResetButtonPanel, DaoSearchInputPanel } from './styled'

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const setSearchInput = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  input.value = content
  input.blur()
}

const DEPOSIT_RANK_COUNT = 100

const DaoSearch = ({ content }: { content?: string }) => {
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
  const inputElement = useRef<HTMLInputElement>(null)

  const handleSearchResult = () => {
    const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
    if (!query) {
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          message: i18n.t('toast.invalid_content'),
        },
      })
    } else {
      searchNervosDaoTransactions(query, dispatch)
    }
  }

  useEffect(() => {
    if (transactionsStatus === 'InProgress') {
      setSearchInput(inputElement, i18n.t('search.loading'))
    } else if (transactionsStatus === 'OK') {
      clearSearchInput(inputElement)
      setShowReset(true)
    } else if (transactionsStatus === 'Error') {
      clearSearchInput(inputElement)
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          message: i18n.t('toast.result_not_found'),
        },
      })
    }
  }, [transactionsStatus, dispatch, content])

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  const SearchIconButton = () => {
    return (
      <DaoSearchImage
        role="button"
        showReset={showReset}
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          handleSearchResult()
        }}
      >
        <img src={isMainnet() ? GreenSearchLogo : BlueSearchLogo} alt="search logo" />
      </DaoSearchImage>
    )
  }

  return (
    <DaoSearchPanel>
      {showReset && (
        <DaoResetButtonPanel
          onClick={() => {
            setShowReset(false)
            getNervosDaoTransactions(dispatch, 1, DEPOSIT_RANK_COUNT)
          }}
        >
          {i18n.t('nervos_dao.dao_search_reset')}
        </DaoResetButtonPanel>
      )}
      <DaoSearchInputPanel
        ref={inputElement}
        showReset={showReset}
        placeholder={placeholder}
        defaultValue={searchValue || ''}
        onBlur={() => {
          setPlaceholder(SearchPlaceholder)
        }}
        onChange={(event: any) => {
          setSearchValue(event.target.value)
        }}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult()
          }
        }}
      />
      <SearchIconButton />
    </DaoSearchPanel>
  )
}

export default DaoSearch
