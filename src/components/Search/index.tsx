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
import { SearchPanel, SearchButton } from './styled'
import { explorerService, Response, SearchResultType } from '../../services/ExplorerService'
import { getReverseAddresses } from '../../services/DidService'
import { ethToCKb as DidEthToCkb } from '../../utils/did'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType, TYPE_ID_CODE_HASH } from '../../constants/common'
import { useForkedState, useIsMobile } from '../../hooks'
import { isChainTypeError } from '../../utils/chain'
import { isAxiosError } from '../../utils/error'
import styles from './index.module.scss'
import { SearchByNameResults } from './SearchByNameResults'
import { useSearchType } from '../../services/AppSettings/hooks'
import { ReactComponent as SearchIcon } from './search.svg'
import { ReactComponent as SpinnerIcon } from './spinner.svg'
import { ReactComponent as ClearIcon } from './clear.svg'
import SimpleButton from '../SimpleButton'
import { isValidBTCAddress } from '../../utils/bitcoin'

// Currently, the API returns all search results, which could be extremely large in quantity.
// Since the rendering component does not implement virtual scrolling, this leads to a significant decrease in page performance.
// Therefore, here we are implementing a frontend-level limitation on the number of displayed results.
const DISPLAY_COUNT = 10

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
  const [searchType, setSearchType] = useSearchType()
  const isSearchByName = searchType === 'name'

  const [keyword, _setKeyword] = useState(content || '')
  const searchValue = keyword.trim()

  const { refetch: refetchSearchById, isFetching: isFetchingById } = useQuery(
    ['searchById', searchValue],
    () => getURLByIdSearch(searchValue),
    {
      enabled: false,
      cacheTime: 0,
    },
  )

  const {
    refetch: refetchSearchByName,
    data: searchByNameResults,
    isFetching: isFetchingByName,
    // TODO: Previously, for some reasons, 'searchValue' was not added to the 'search' key here.
    // However, no problems were found in the tests after refactoring, so it has been added back for now.
    // If problems occur later, you can confirm here again. If no problems are found after a period of time, this comment can be removed.
  } = useQuery(['searchByName', searchValue], () => explorerService.api.fetchSearchByNameResult(searchValue), {
    enabled: false,
  })

  const handleSearch = () => {
    if (isSearchByName && searchByNameResults) {
      const item = searchByNameResults[0]
      let url = ''
      if (item.udtType === 'omiga_inscription') {
        url = `/inscription/${item.typeHash}`
      } else if (item.udtType === 'sudt') {
        url = `/sudt/${item.typeHash}`
      } else if (item.udtType === 'xudt') {
        url = `/xudt/${item.typeHash}`
      }
      if (!url) return
      history.push(url)
      handleEditEnd?.()
      return
    }

    if (!isSearchByName && searchValue) {
      refetchSearchById().then(res => {
        history.push(res.data ?? `/search/fail?q=${searchValue}`)
        handleEditEnd?.()
      })
    }
  }

  const debouncedSearchByName = useMemo(
    () => debounce(refetchSearchByName, 1000, { trailing: true }),
    [refetchSearchByName],
  )

  const resetSearchByName = useCallback(() => {
    debouncedSearchByName.cancel()
    queryClient.resetQueries(['searchByName', searchValue])
  }, [debouncedSearchByName, queryClient, searchValue])

  useEffect(() => {
    if (isSearchByName && searchValue) {
      debouncedSearchByName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchByName, searchValue])

  const switchSearchType = useCallback(() => {
    setSearchType(type => (type === 'name' ? 'id' : 'name'))
    resetSearchByName()
  }, [resetSearchByName, setSearchType])

  const onClear = useCallback(() => {
    resetSearchByName()
    handleClear?.()
  }, [resetSearchByName, handleClear])

  const setKeyword = (value: string) => {
    if (value === '') onClear()
    _setKeyword(value)
  }

  return (
    <SearchPanel moreHeight={hasButton} hasButton={hasButton}>
      {isFetchingById ? (
        <SpinnerIcon className={classNames(styles.preIcon, styles.spinner)} />
      ) : (
        <SearchIcon className={styles.preIcon} />
      )}

      <SearchInput
        autoFocus={!isMobile}
        loading={isFetchingById}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        onEnter={handleSearch}
        placeholder={isSearchByName ? t('navbar.search_by_name_placeholder') : t('navbar.search_placeholder')}
      />

      {searchValue && (
        <SimpleButton className={styles.clear} title="clear" onClick={() => setKeyword('')}>
          <ClearIcon />
        </SimpleButton>
      )}
      <SimpleButton className={styles.byNameOrId} onClick={switchSearchType}>
        {isSearchByName ? t('search.by_name') : t('search.by_id')}
      </SimpleButton>
      {hasButton && <SearchButton onClick={handleSearch}>{t('search.search')}</SearchButton>}

      {isSearchByName && (isFetchingByName || searchByNameResults) && (
        <SearchByNameResults
          keyword={keyword}
          udtQueryResults={searchByNameResults?.slice(0, DISPLAY_COUNT) ?? []}
          loading={isFetchingByName}
        />
      )}
    </SearchPanel>
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

const getURLByIdSearch = async (searchValue: string) => {
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
    const { data } = await explorerService.api.fetchSearchByIdResult(addPrefixForHash(query))
    const { type, attributes } = data
    switch (type) {
      // 1. when query by type_id, first it will use type_id as args to find type script, then use this type script's script_hash as code_hash to find script
      // 2. when query by code_hash, it will directly query script by code_hash
      case SearchResultType.TypeScript:
        if (attributes.codeHash === TYPE_ID_CODE_HASH) {
          return `/script/${attributes.scriptHash}/${attributes.hashType}`
        }
        return `/script/${attributes.codeHash}/${attributes.hashType}`

      case SearchResultType.LockScript:
        return `/script/${attributes.codeHash}/${attributes.hashType}`

      case SearchResultType.Block:
        return `/block/${attributes.blockHash}`

      case SearchResultType.Transaction:
        return `/transaction/${attributes.transactionHash}`

      case SearchResultType.Address:
        return `/address/${attributes.addressHash}`

      case SearchResultType.LockHash:
        return `/address/${attributes.lockHash}`

      case SearchResultType.UDT:
        if (attributes.udtType === 'omiga_inscription') {
          return `/inscription/${query}`
        }
        if (attributes.udtType === 'sudt') {
          return `/sudt/${query}`
        }
        if (attributes.udtType === 'xudt') {
          return `/xudt/${query}`
        }
        break

      case SearchResultType.BtcTx:
        return `/transaction/${attributes.ckbTransactionHash}`

      default:
        break
    }
  } catch (error) {
    if (
      isAxiosError(error) &&
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
