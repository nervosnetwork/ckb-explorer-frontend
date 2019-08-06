import React, { useState, useRef, useEffect, useContext } from 'react'
import { AxiosError } from 'axios'
import {
  SearchImage,
  SearchInputPanel,
  SearchPanel,
  SuggestionsPanel,
  SuggestionHeading,
  SuggestionButton,
  SuggestionExpand,
  SuggestionBalance,
  SuggestionValue,
} from './styled'
import { fetchSearchResult, fetchTipBlockNumber } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search.png'
import GreenSearchLogo from '../../assets/search_green.png'
import { searchTextCorrection, parseLongAddressHashMobile } from '../../utils/string'
import {
  generateBlockHeightSuggestions,
  generateTransactionSuggestion,
  generateAddressSuggestion,
  generateLockHashSuggestion,
  generateBlockHashSuggestion,
} from '../../utils/util'

import i18n from '../../utils/i18n'
import { HttpErrorCode, SEARCH_DEBOUNCE_INTERVAL } from '../../utils/const'
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
    fetchSearchResult(searchTextCorrection(query))
      .then((response: any) => {
        const input: any = inputElement.current!
        input.value = ''
        const { data } = response
        if (data.type === SearchResultType.Block) {
          browserHistory.push(`/block/${(data as Response.Wrapper<State.Block>).attributes.block_hash}`)
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
  const [searchSuggestions, setSearchSuggestions] = useState([] as SearchSuggestion[])
  const [expandSuggestions, setExpandSuggestions] = useState(false)
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const [maximumBlockHeight, setMaximumBlockHeight] = useState(0)
  const inputElement = useRef<HTMLInputElement>(null)
  const { components } = useContext(AppContext)
  const { searchBarEditable } = components

  useEffect(() => {
    ;(async () => {
      const { attributes } = await fetchTipBlockNumber()
      setMaximumBlockHeight(attributes.tip_block_number)
    })()
  }, [])

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [])

  useEffect(() => {
    const searchQueryTimeout = setTimeout(async () => {
      try {
        if (searchValue) {
          const correctedSearchValue = searchTextCorrection(searchValue)
          const { data } = await fetchSearchResult(correctedSearchValue)

          if (data.type.toLowerCase() === 'block') {
            if (correctedSearchValue.slice(0, 2) === '0x') {
              const blockHash = generateBlockHashSuggestion(correctedSearchValue)
              setSearchSuggestions([blockHash])
            } else {
              const blockHeights = generateBlockHeightSuggestions(
                parseInt(correctedSearchValue, 10),
                maximumBlockHeight,
              )
              setSearchSuggestions(blockHeights)
            }
          } else if (data.type.toLowerCase() === 'ckb_transaction') {
            const transactionSuggestion = generateTransactionSuggestion(correctedSearchValue)
            setSearchSuggestions([transactionSuggestion])
          } else if (data.type.toLowerCase() === 'address' && data.attributes.balance) {
            const addressSuggestion = generateAddressSuggestion(correctedSearchValue, data.attributes.balance)
            setSearchSuggestions([addressSuggestion])
          } else if (data.type.toLowerCase() === 'lock_hash') {
            const lockHashSuggestion = generateLockHashSuggestion(correctedSearchValue)
            setSearchSuggestions([lockHashSuggestion])
          }
        } else {
          setSearchSuggestions([])
        }
      } catch (error) {
        setSearchSuggestions([
          {
            type: 'Searching fail !',
          },
        ])
      }
    }, SEARCH_DEBOUNCE_INTERVAL)

    return () => clearTimeout(searchQueryTimeout)
  }, [searchValue, maximumBlockHeight])

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

  const onSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.path && suggestion.type !== 'Searching fail !') {
      setSearchValue('')
      browserHistory.push(suggestion.path)
    }
  }

  return (
    <SearchPanel>
      {!hasBorder && <SearchIconButton />}
      {isMobile() && <div className="search__icon__separate" />}
      <SearchInputPanel
        placeholder={placeholder}
        value={searchValue}
        hasBorder={!!hasBorder}
        onFocus={async () => {
          setPlaceholder('')
          const { attributes } = await fetchTipBlockNumber()
          setMaximumBlockHeight(attributes.tip_block_number)
        }}
        ref={inputElement}
        // onBlur={() => { // causes a race condition with onSuggestionSelect
        // 	setPlaceholder(SearchPlaceholder);
        // 	dispatch({
        // 		type: ComponentActions.UpdateHeaderSearchEditable,
        // 		payload: {
        // 			searchBarEditable: false
        // 		}
        // 	});
        // }}
        onChange={async (event: any) => {
          setExpandSuggestions(false)
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

      {searchSuggestions.length > 0 && searchValue ? (
        <SuggestionsDropdown
          suggestions={searchSuggestions}
          onSuggestionSelect={onSuggestionSelect}
          expandSuggestions={expandSuggestions}
          setExpandSuggestions={setExpandSuggestions}
        />
      ) : null}
    </SearchPanel>
  )
}

interface SearchSuggestion {
  value?: string
  balance?: number
  path?: string
  type: string
}

const generateSuggestionValue = (suggestion: SearchSuggestion) => {
  if (isMobile() && suggestion.type !== 'Block Height' && suggestion.value) {
    return parseLongAddressHashMobile(suggestion.value)
  }
  return suggestion.value
}

const generateFormattedBalance = (suggestion: SearchSuggestion) => {
  if (suggestion.balance) {
    return `${(suggestion.balance / 10 ** 8).toFixed(3)} CKB`
  }
  return ''
}

const SuggestionsDropdown = ({
  suggestions = [],
  onSuggestionSelect,
  expandSuggestions,
  setExpandSuggestions,
}: {
  suggestions: SearchSuggestion[]
  onSuggestionSelect: any
  expandSuggestions: boolean
  setExpandSuggestions: any
}) => (
  <SuggestionsPanel>
    <SuggestionHeading>{suggestions.length > 0 && suggestions[0].type}</SuggestionHeading>
    {suggestions
      .slice(0, expandSuggestions ? suggestions.length : 3)
      .filter(suggestion => suggestion.type !== 'Searching fail!')
      .map(suggestion => {
        return (
          <SuggestionButton
            key={`${suggestion.value}${suggestions.findIndex(s => s.value === suggestion.value)}`}
            type="button"
            onClick={() => onSuggestionSelect(suggestion)}
          >
            <SuggestionValue>{generateSuggestionValue(suggestion)}</SuggestionValue>
            <SuggestionBalance>{generateFormattedBalance(suggestion)}</SuggestionBalance>
          </SuggestionButton>
        )
      })}
    {suggestions.length > 3 && !expandSuggestions && (
      <SuggestionExpand onClick={() => setExpandSuggestions(true)}>More</SuggestionExpand>
    )}
  </SuggestionsPanel>
)

export default Search
