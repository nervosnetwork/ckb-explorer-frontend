import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { SearchImage, SearchInputPanel, SearchPanel } from './styled'
import { fetchSearchResult } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search.png'
import GreenSearchLogo from '../../assets/search_green.png'
import BlueSearchLogo from '../../assets/search_blue.png'
import { addPrefixForHash } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode, CachedKeys, SearchFailType } from '../../utils/const'
import { AppDispatch, AppActions, ComponentActions } from '../../contexts/providers/reducer'
import { isMobile } from '../../utils/screen'
import { AppContext } from '../../contexts/providers'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { isMainnet } from '../../utils/chain'

enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
}

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const setSearchLoading = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = i18n.t('search.loading')
}

const setSearchContent = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  input.value = content
}

const handleSearchResult = (
  searchValue: string,
  inputElement: any,
  searchBarEditable: boolean,
  dispatch: AppDispatch,
) => {
  const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
  if (!query) {
    dispatch({
      type: AppActions.ShowToastMessage,
      payload: {
        message: i18n.t('toast.invalid_content'),
      },
    })
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
          browserHistory.push(
            `/transaction/${(data as Response.Wrapper<State.Transaction>).attributes.transactionHash}`,
          )
        } else if (data.type === SearchResultType.Address) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.addressHash}`)
        } else if (data.type === SearchResultType.LockHash) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.lockHash}`)
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

const Search = ({ dispatch, hasBorder, content }: { dispatch: AppDispatch; hasBorder?: boolean; content?: string }) => {
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return t('navbar.search_placeholder')
  }, [t])
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const [isFirst, setIsFirst] = useState(true)
  const inputElement = useRef<HTMLInputElement>(null)
  const { components } = useContext(AppContext)
  const { searchBarEditable } = components

  // fetch searching data when refreshing search fail page
  useEffect(() => {
    if (!isFirst) return
    setIsFirst(false)
    const visitedCount: number = fetchCachedData(CachedKeys.SearchFailVisitedCount) || 0
    if (visitedCount > 0 && searchValue) {
      handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)
    }
    if (hasBorder) {
      storeCachedData(CachedKeys.SearchFailVisitedCount, visitedCount + 1)
    } else {
      storeCachedData(CachedKeys.SearchFailVisitedCount, 0)
    }
  }, [hasBorder, searchValue, setSearchValue, searchBarEditable, dispatch, isFirst])

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  // set input focus when mobile search bar state change
  useEffect(() => {
    if (searchBarEditable && inputElement.current) {
      inputElement.current.focus()
    }
  }, [searchBarEditable])

  const SearchIconButton = ({ highlightIcon }: { highlightIcon?: boolean }) => {
    const getSearchIcon = () => {
      if (isMainnet()) {
        return highlightIcon ? GreenSearchLogo : SearchLogo
      }
      return highlightIcon ? BlueSearchLogo : SearchLogo
    }
    return (
      <SearchImage
        highlightIcon={!!highlightIcon}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          if (highlightIcon) {
            handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)
          }
        }}
      >
        <img src={getSearchIcon()} alt="search logo" />
      </SearchImage>
    )
  }
  return (
    <SearchPanel hasBorder={!!hasBorder}>
      {!hasBorder && <SearchIconButton />}
      {isMobile() && <div className="search__icon__separate" />}
      <SearchInputPanel
        ref={inputElement}
        placeholder={placeholder}
        defaultValue={searchValue || ''}
        hasBorder={!!hasBorder}
        onBlur={() => {
          if (!hasBorder) {
            clearSearchInput(inputElement)
          }
          setPlaceholder(SearchPlaceholder)
          if (searchBarEditable) {
            dispatch({
              type: ComponentActions.UpdateHeaderSearchEditable,
              payload: {
                searchBarEditable: false,
              },
            })
          }
        }}
        onChange={(event: any) => {
          setSearchValue(event.target.value)
        }}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)
          }
        }}
      />
      {hasBorder && <SearchIconButton highlightIcon />}
    </SearchPanel>
  )
}

export default Search
