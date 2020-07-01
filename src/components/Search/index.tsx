import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { SearchImage, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { fetchSearchResult } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode, SearchFailType } from '../../utils/const'
import { AppDispatch } from '../../contexts/reducer'
import { ComponentActions } from '../../contexts/actions'
import { useAppState, useDispatch } from '../../contexts/providers'

enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
  UDT = 'udt',
}

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  if (input) {
    input.value = ''
    input.blur()
  }
}

const setSearchLoading = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = i18n.t('search.loading')
}

const setSearchContent = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  if (input) {
    input.value = content
  }
}

const handleSearchResult = (searchValue: string, inputElement: any, searchBarEditable: boolean, dispatch: AppDispatch) => {
  const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
  if (!query || containSpecialChar(query)) {
    browserHistory.push(`/search/fail?q=${query}`)
    return
  } else {
    if (searchBarEditable) {
      dispatch({
        type: ComponentActions.UpdateHeaderSearchEditable,
        payload: {
          searchBarEditable: false,
        },
      })
    }
    setSearchLoading(inputElement)
    fetchSearchResult(addPrefixForHash(query))
      .then((response: any) => {
        const { data } = response
        if (!response || !data.type) {
          browserHistory.push(`/search/fail?q=${query}`)
          return
        }
        clearSearchInput(inputElement)
        if (data.type === SearchResultType.Block) {
          browserHistory.push(`/block/${(data as Response.Wrapper<State.Block>).attributes.blockHash}`)
        } else if (data.type === SearchResultType.Transaction) {
          browserHistory.push(`/transaction/${(data as Response.Wrapper<State.Transaction>).attributes.transactionHash}`)
        } else if (data.type === SearchResultType.Address) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.addressHash}`)
        } else if (data.type === SearchResultType.LockHash) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.lockHash}`)
        } else if (data.type === SearchResultType.UDT) {
          browserHistory.push(`/sudt/${query}`)
        }
      })
      .catch((error: AxiosError) => {
        setSearchContent(inputElement, query)
        if (error.response && error.response.data) {
          if (error.response.status === 404 || error.response.status === 422) {
            if (
              (error.response.data as Response.Error[]).find((errorData: Response.Error) => {
                return errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS
              })
            ) {
              clearSearchInput(inputElement)
              browserHistory.push(`/address/${query}`)
            } else if (
              (error.response.data as Response.Error[]).find((errorData: Response.Error) => {
                return errorData.code === HttpErrorCode.ADDRESS_TYPE_ERROR
              })
            ) {
              browserHistory.push(`/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`)
            } else {
              browserHistory.push(`/search/fail?q=${query}`)
            }
          } else {
            browserHistory.push(`/search/fail?q=${query}`)
          }
        } else {
          browserHistory.push(`/search/fail?q=${query}`)
        }
      })
  }
}

const Search = ({ content, hasButton }: { content?: string; hasButton?: boolean }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return t('navbar.search_placeholder')
  }, [t])
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const inputElement = useRef<HTMLInputElement>(null)
  const {
    components: { searchBarEditable },
  } = useAppState()

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  useEffect(() => {
    if (inputElement.current) {
      const input = inputElement.current as HTMLInputElement
      input.focus()
    }
  }, [])

  const clearSearchAction = (isClear?: boolean) => {
    if (isClear) {
      setSearchValue('')
      clearSearchInput(inputElement)
      dispatch({
        type: ComponentActions.UpdateHeaderSearchEditable,
        payload: {
          searchBarEditable: false,
        },
      })
    }
  }

  const inputChangeAction = (event: any) => {
    setSearchValue(event.target.value)
    dispatch({
      type: ComponentActions.UpdateHeaderSearchEditable,
      payload: {
        searchBarEditable: !!event.target.value,
      },
    })
  }

  const searchKeyAction = (event: any) => {
    if (event.keyCode === 13) {
      handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)
    }
  }

  const ImageIcon = ({ isClear }: { isClear?: boolean }) => {
    return (
      <SearchImage isClear={isClear} onClick={() => clearSearchAction(isClear)}>
        <img src={isClear ? ClearLogo : SearchLogo} alt="search logo" />
      </SearchImage>
    )
  }

  return (
    <SearchContainer>
      <SearchPanel moreHeight={hasButton} hasButton={hasButton}>
        <ImageIcon />
        <SearchInputPanel
          searchBarEditable={searchBarEditable}
          ref={inputElement}
          placeholder={placeholder}
          defaultValue={searchValue || ''}
          onChange={(event: any) => inputChangeAction(event)}
          onKeyUp={(event: any) => searchKeyAction(event)}
        />
        {searchValue && <ImageIcon isClear />}
      </SearchPanel>
      {hasButton && (
        <SearchButton onClick={() => handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)}>
          {i18n.t('search.search')}
        </SearchButton>
      )}
    </SearchContainer>
  )
}

export default Search
