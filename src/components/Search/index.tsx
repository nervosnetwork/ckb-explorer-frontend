import {
  useState,
  useEffect,
  FC,
  memo,
  useMemo,
  useCallback,
  ChangeEventHandler,
  KeyboardEventHandler,
  ComponentPropsWithoutRef,
} from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { explorerService, Response, SearchResultType, type AggregateSearchResult } from '../../services/ExplorerService'
import { getReverseAddresses } from '../../services/DidService'
import { ethToCKb as DidEthToCkb } from '../../utils/did'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { useForkedState, useIsMobile } from '../../hooks'
import { isChainTypeError } from '../../utils/chain'
import { isRequestError } from '../../utils/error'
import styles from './index.module.scss'
import { getURLByAggregateSearchResult } from './utils'
import { AggregateSearchResults } from './AggregateSearchResults'
import { ReactComponent as SearchIcon } from './search.svg'
import { ReactComponent as SpinnerIcon } from './spinner.svg'
import { ReactComponent as ClearIcon } from './clear.svg'
import SimpleButton from '../SimpleButton'
import { isValidBTCAddress } from '../../utils/bitcoin'

const ALLOW_SEARCH_TYPES = [
  SearchResultType.Address,
  SearchResultType.Block,
  SearchResultType.BtcTx,
  SearchResultType.LockHash,
  SearchResultType.LockScript,
  SearchResultType.Transaction,
  SearchResultType.TypeScript,
  SearchResultType.TokenCollection,
  SearchResultType.TokenItem,
  SearchResultType.UDT,
  SearchResultType.DID,
  SearchResultType.BtcAddress,
  SearchResultType.FiberGraphNode,
]

async function fetchAggregateSearchResult(searchValue: string): Promise<AggregateSearchResult[]> {
  let results = await explorerService.api
    .fetchAggregateSearchResult(addPrefixForHash(searchValue))
    .then(res => res.data)
    .catch(() => [] as AggregateSearchResult[])

  if (/\w*\.bit$/.test(searchValue)) {
    // search .bit name
    const list = await getReverseAddresses(searchValue)
    const ETH_COIN_TYPE = '60'
    const ethAddr = list?.find(item => item.key_info.coin_type === ETH_COIN_TYPE)
    if (ethAddr) {
      const ckbAddr = DidEthToCkb(ethAddr.key_info.key)
      results = [
        ...results,
        {
          id: Math.random(),
          type: SearchResultType.DID,
          attributes: {
            did: searchValue,
            address: ckbAddr,
          },
        },
      ]
    }
  }

  return results
}

const Search: FC<{
  content?: string
  hasButton?: boolean
  onEditEnd?: () => void
  onClear?: () => void
}> = memo(({ content, hasButton, onEditEnd: handleEditEnd, onClear: handleClear }) => {
  const history = useHistory()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const [keyword, _setKeyword] = useState(content || '')
  const searchValue = keyword.trim()

  const {
    refetch: refetchAggregateSearch,
    data: _aggregateSearchResults,
    isFetching,
    // TODO: Previously, for some reasons, 'searchValue' was not added to the 'search' key here.
    // However, no problems were found in the tests after refactoring, so it has been added back for now.
    // If problems occur later, you can confirm here again. If no problems are found after a period of time, this comment can be removed.
  } = useQuery(['aggregateSearch', searchValue], () => fetchAggregateSearchResult(searchValue), {
    enabled: false,
  })

  const aggregateSearchResults = _aggregateSearchResults?.filter(item => ALLOW_SEARCH_TYPES.includes(item.type))

  const handleSearch = () => {
    if (aggregateSearchResults && aggregateSearchResults.length > 0) {
      const url = getURLByAggregateSearchResult(aggregateSearchResults[0])
      history.push(url ?? `/search/fail?q=${searchValue}`)
      handleEditEnd?.()
      return
    }

    if (searchValue) {
      getURLBySearchValue(searchValue).then(url => {
        history.push(url ?? `/search/fail?q=${searchValue}`)
        handleEditEnd?.()
      })
    }
  }

  const debouncedSearchByName = useMemo(
    () => debounce(refetchAggregateSearch, 1500, { trailing: true }),
    [refetchAggregateSearch],
  )

  const resetSearchByName = useCallback(() => {
    debouncedSearchByName.cancel()
    queryClient.resetQueries(['aggregateSearch', searchValue])
  }, [debouncedSearchByName, queryClient, searchValue])

  useEffect(() => {
    if (searchValue) {
      debouncedSearchByName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const onClear = useCallback(() => {
    resetSearchByName()
    handleClear?.()
  }, [resetSearchByName, handleClear])

  const setKeyword = (value: string) => {
    if (value === '') onClear()
    _setKeyword(value)
  }

  return (
    <div
      className={styles.searchPanel}
      style={{
        height: hasButton ? '40px' : '32px',
        paddingRight: hasButton ? '0' : '8px',
      }}
    >
      {isFetching ? (
        <SpinnerIcon className={classNames(styles.preIcon, styles.spinner)} />
      ) : (
        <SearchIcon className={styles.preIcon} />
      )}

      <SearchInput
        autoFocus={!isMobile}
        loading={isFetching}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        onEnter={handleSearch}
        placeholder={t('navbar.search_placeholder')}
      />

      {searchValue && (
        <SimpleButton className={styles.clear} title="clear" onClick={() => setKeyword('')}>
          <ClearIcon />
        </SimpleButton>
      )}
      {hasButton && (
        <div className={styles.searchButton} onClick={handleSearch}>
          {t('search.search')}
        </div>
      )}

      {(isFetching || aggregateSearchResults) && (
        <AggregateSearchResults keyword={keyword} results={aggregateSearchResults ?? []} loading={isFetching} />
      )}
    </div>
  )
})

const SearchInput: FC<
  ComponentPropsWithoutRef<'input'> & {
    onEnter?: () => void
    loading?: boolean
  }
> = ({ loading, onEnter, value: propsValue, onChange: propsOnChange, onKeyUp: propsOnKeyUp, ...elprops }) => {
  const [value, setValue] = useForkedState(propsValue)

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (loading) {
        return
      }
      setValue(event.target.value)
      propsOnChange?.(event)
    },
    [propsOnChange, setValue, loading],
  )

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
    event => {
      const isEnter = event.keyCode === 13
      if (isEnter) {
        onEnter?.()
      }
      propsOnKeyUp?.(event)
    },
    [onEnter, propsOnKeyUp],
  )

  return (
    <input
      enterKeyHint="search"
      className={styles.searchInputPanel}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      {...elprops}
    />
  )
}

const getURLBySearchValue = async (searchValue: string) => {
  // check whether is btc address
  if (isValidBTCAddress(searchValue)) {
    return `/address/${searchValue}`
  }
  if (/\w*\.bit$/.test(searchValue)) {
    // search .bit name
    const list = await getReverseAddresses(searchValue)
    const ETH_COIN_TYPE = '60'
    const ethAddr = list?.find(item => item.key_info.coin_type === ETH_COIN_TYPE)
    if (ethAddr) {
      const ckbAddr = DidEthToCkb(ethAddr.key_info.key)
      return `/address/${ckbAddr}`
    }
  }
  // TODO: Is this replace needed?
  const query = addPrefixForHash(searchValue).replace(',', '')
  if (!query || containSpecialChar(query)) {
    return `/search/fail?q=${query}`
  }
  if (isChainTypeError(query)) {
    return `/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`
  }

  try {
    const data = await fetchAggregateSearchResult(addPrefixForHash(query))
    return getURLByAggregateSearchResult(data[0])
  } catch (error) {
    if (
      isRequestError(error) &&
      error.response?.data &&
      error.response.status === 404 &&
      (error.response.data as Response.Error[]).find(
        (errorData: Response.Error) => errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS,
      )
    ) {
      return `/address/${query}`
    }

    return `/search/fail?q=${query}`
  }
}

export default Search
