import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../utils/i18n'
import SearchLogo from '../../../assets/search_black.png'
import ClearLogo from '../../../assets/clear.png'
import { AppActions, ComponentActions } from '../../../contexts/actions'
import { searchNervosDaoTransactions, getNervosDaoTransactions } from '../../../service/app/nervosDao'
import { useDispatch, useAppState } from '../../../contexts/providers'
import { DaoSearchPanel, DaoSearchInputPanel, DaoSearchImage } from './styled'

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
    components: { searchBarEditable },
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
          type: 'danger',
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
          type: 'warning',
        },
      })
    }
  }, [transactionsStatus, dispatch, content])

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  const ClearIconButton = () => {
    const dispatch = useDispatch()
    return (
      <DaoSearchImage
        isRight={true}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          getNervosDaoTransactions(dispatch, 1, DEPOSIT_RANK_COUNT)
          dispatch({
            type: ComponentActions.UpdateHeaderSearchEditable,
            payload: {
              searchBarEditable: false,
            },
          })
        }}
      >
        <img src={ClearLogo} alt="search clear logo" />
      </DaoSearchImage>
    )
  }

  return (
    <DaoSearchPanel>
      <DaoSearchImage
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          handleSearchResult()
        }}
      >
        <img src={SearchLogo} alt="search logo" />
      </DaoSearchImage>
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
      {searchBarEditable && <ClearIconButton />}
    </DaoSearchPanel>
  )
}

export default DaoSearch
