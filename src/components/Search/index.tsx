import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { SearchImage, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { fetchSearchResult } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search_black.png'
import GreenSearchLogo from '../../assets/search_green.png'
import BlueSearchLogo from '../../assets/search_blue.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode, SearchFailType } from '../../utils/const'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, ComponentActions } from '../../contexts/actions'
import { isMobile } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers'
import { isMainnet } from '../../utils/chain'

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

const ClearIconButton = () => {
  const dispatch = useDispatch()
  return (
    <SearchImage
      highlightIcon={false}
      role="button"
      tabIndex={-1}
      onKeyPress={() => {}}
      onClick={() => {
        dispatch({
          type: ComponentActions.UpdateHeaderSearchEditable,
          payload: {
            searchBarEditable: false,
          },
        })
      }}
    >
      <img src={ClearLogo} alt="search logo" />
    </SearchImage>
  )
}

const SearchIconButton = ({
  searchValue,
  inputElement,
  highlightIcon,
}: {
  searchValue: string
  inputElement: any
  highlightIcon?: boolean
}) => {
  const dispatch = useDispatch()
  const {
    components: { searchBarEditable },
  } = useAppState()
  const getSearchIcon = () => {
    if (highlightIcon) {
      return isMainnet() ? GreenSearchLogo : BlueSearchLogo
    }
    return SearchLogo
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

const Search = ({ hasBorder, content, hasButton }: { hasBorder?: boolean; content?: string; hasButton?: boolean }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    const placeholder = t('navbar.search_placeholder')
    return isMainnet() ? placeholder.substring(0, placeholder.lastIndexOf('/')) : placeholder
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
    if (searchBarEditable && inputElement.current) {
      const input = inputElement.current as HTMLInputElement
      input.focus()
    }
  }, [searchBarEditable])

  return (
    <SearchContainer>
      <SearchPanel moreHeight={hasBorder || hasButton} hasButton={hasButton}>
        {!hasBorder && !searchBarEditable && <SearchIconButton searchValue={searchValue} inputElement={inputElement} />}
        {isMobile() && <div className="search__icon__separate" />}
        <SearchInputPanel
          searchBarEditable={searchBarEditable}
          ref={inputElement}
          placeholder={placeholder}
          defaultValue={searchValue || ''}
          hasBorder={hasBorder}
          onFocus={() => {
            if (!hasBorder) {
              dispatch({
                type: ComponentActions.UpdateHeaderSearchEditable,
                payload: {
                  searchBarEditable: true,
                },
              })
            }
          }}
          onBlur={() => {
            if (isMobile()) {
              if (!hasBorder) {
                handleSearchResult(searchValue, inputElement, searchBarEditable, dispatch)
              }
            } else {
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
        {!hasBorder && searchBarEditable && <ClearIconButton />}
        {hasBorder && <SearchIconButton highlightIcon searchValue={searchValue} inputElement={inputElement} />}
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
