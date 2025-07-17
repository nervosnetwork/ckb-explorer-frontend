import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import debounce from 'lodash.debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ALLOW_SEARCH_TYPES,
  fetchAggregateSearchResult,
  getURLByAggregateSearchResult,
  getURLBySearchValue,
} from './utils'

export function useSearch({
  content,
  onEditEnd,
  onClear,
  debounceTime = 1500,
}: {
  content?: string
  onEditEnd?: () => void
  onClear?: () => void
  debounceTime?: number
}) {
  const history = useHistory()
  const queryClient = useQueryClient()

  const [keyword, setKeyword] = useState(content || '')
  const searchValue = keyword.trim()

  const {
    refetch: refetchAggregateSearch,
    data: _aggregateSearchResults,
    isFetching,
  } = useQuery(['aggregateSearch', searchValue], () => fetchAggregateSearchResult(searchValue), {
    enabled: false,
  })

  const aggregateSearchResults = _aggregateSearchResults?.filter(item => ALLOW_SEARCH_TYPES.includes(item.type))

  const handleSearch = () => {
    if (aggregateSearchResults && aggregateSearchResults.length > 0) {
      const url = getURLByAggregateSearchResult(aggregateSearchResults[0])
      history.push(url ?? `/search/fail?q=${searchValue}`)
      onEditEnd?.()
      return
    }

    if (searchValue) {
      getURLBySearchValue(searchValue).then(url => {
        history.push(url ?? `/search/fail?q=${searchValue}`)
        onEditEnd?.()
      })
    }
  }

  const debouncedSearchByName = useMemo(
    () => debounce(refetchAggregateSearch, debounceTime, { trailing: true }),
    [refetchAggregateSearch, debounceTime],
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

  const handleClear = useCallback(() => {
    resetSearchByName()
    onClear?.()
  }, [resetSearchByName, onClear])

  return {
    keyword,
    searchValue,
    setKeyword: (value: string) => {
      if (value === '') handleClear()
      setKeyword(value)
    },
    handleSearch,
    isFetching,
    aggregateSearchResults,
  }
}
