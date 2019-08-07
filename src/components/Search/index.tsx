import React, { useState, useRef, useEffect, useContext } from 'react'
import { AxiosError } from 'axios'
import { SearchImage, SearchInputPanel, SearchPanel } from './styled'
import { fetchSearchResult } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search.png'
import GreenSearchLogo from '../../assets/search_green.png'
import { addPrefixForHash } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode } from '../../utils/const'
import { AppDispatch, AppActions, ComponentActions } from '../../contexts/providers/reducer'
import { isMobile } from '../../utils/screen'
import { AppContext } from '../../contexts/providers'

const SearchPlaceholder = i18n.t('navbar.search_placeholder')

enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
}

const handleSearchResult = ({
  searchValue,
  setSearchValue,
  inputElement,
  searchBarEditable,
  dispatch,
}: {
  searchValue: string
  setSearchValue: any
  inputElement: any
  searchBarEditable: boolean
  dispatch: AppDispatch
}) => {
  const query = searchValue.replace(/^\s+|\s+$/g, '').replace(',', '') // remove front and end blank and ','
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
    fetchSearchResult(addPrefixForHash(query))
      .then((response: any) => {
        const input: any = inputElement.current!
        input.value = ''
        const { data } = response
        if (data.type === SearchResultType.Block) {
          browserHistory.push(`/block/${(data as Response.Wrapper<State.Block>).attributes.blockHash}`)
        } else if (data.type === SearchResultType.Transaction) {
          browserHistory.push(
            `/transaction/${(data as Response.Wrapper<State.Transaction>).attributes.transaction_hash}`,
          )
        } else if (data.type === SearchResultType.Address) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.address_hash}`)
        } else if (data.type === SearchResultType.LockHash) {
          browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.lock_hash}`)
        } else {
          setSearchValue(query)
          browserHistory.push(`/search/fail?q=${query}`)
        }
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          if (
            (error.response.data as Response.Error[]).find((errorData: Response.Error) => {
              return errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS
            })
          ) {
            browserHistory.push(`/address/${query}`)
          } else {
            setSearchValue(query)
            browserHistory.push(`/search/fail?q=${query}`)
          }
        } else {
          setSearchValue(query)
          browserHistory.push(`/search/fail?q=${query}`)
        }
      })
  }
}

const Search = ({ dispatch, hasBorder, content }: { dispatch: AppDispatch; hasBorder?: boolean; content?: string }) => {
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const inputElement = useRef<HTMLInputElement>(null)
  const { components } = useContext(AppContext)
  const { searchBarEditable } = components

  useEffect(() => {
    if (searchBarEditable && inputElement.current) {
      inputElement.current.focus()
    }
  }, [searchBarEditable])

  const SearchIconButton = ({ greenIcon }: { greenIcon?: boolean }) => {
    return (
      <SearchImage
        greenIcon={!!greenIcon}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          if (greenIcon) {
            handleSearchResult({
              searchValue,
              setSearchValue,
              inputElement,
              searchBarEditable,
              dispatch,
            })
          }
        }}
      >
        <img src={greenIcon ? GreenSearchLogo : SearchLogo} alt="search logo" />
      </SearchImage>
    )
  }
  return (
    <SearchPanel>
      {!hasBorder && <SearchIconButton />}
      {isMobile() && <div className="search__icon__separate" />}
      <SearchInputPanel
        ref={inputElement}
        placeholder={placeholder}
        defaultValue={searchValue || ''}
        hasBorder={!!hasBorder}
        onFocus={() => setPlaceholder('')}
        onBlur={() => {
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
            handleSearchResult({
              searchValue,
              setSearchValue,
              inputElement,
              searchBarEditable,
              dispatch,
            })
          }
        }}
      />
      {hasBorder && <SearchIconButton greenIcon />}
    </SearchPanel>
  )
}

export default Search
