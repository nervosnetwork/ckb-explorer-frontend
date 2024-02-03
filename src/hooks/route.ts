import { useEffect, useMemo, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ListPageParams, PageParams } from '../constants/common'
import { omit, omitNil } from '../utils/object'

function getSearchParams<T extends string = string>(search: string, names?: T[]): Partial<Record<T, string>> {
  const urlSearchParams = new URLSearchParams(search)
  const entries = [...urlSearchParams.entries()].filter(
    (entry): entry is [T, string] => names == null || (names as string[]).includes(entry[0]),
  )
  return Object.fromEntries(entries) as Partial<Record<T, string>>
}

export function useSearchParams<T extends string>(...names: T[]): Partial<Record<T, string>> {
  const location = useLocation()
  return useMemo(() => getSearchParams(location.search, names), [location.search, names])
}

export type OrderByType = 'asc' | 'desc'

// REFACTOR: remove useSearchParams
export function useSortParam<T extends string>(
  isSortBy?: (s?: string) => boolean,
  defaultValue?: string,
): {
  sortBy: T | undefined
  orderBy: OrderByType
  sort?: string
  handleSortClick: (sortRule?: T) => void
} {
  type SortType = T | undefined
  function isSortByType(s?: string): s is SortType {
    if (!isSortBy) return true
    return isSortBy(s) || s === undefined
  }
  function isOrderByType(s?: string): s is OrderByType {
    return s === 'asc' || s === 'desc'
  }
  const { sort: sortParam = defaultValue } = useSearchParams('sort')
  const updateSearchParams = useUpdateSearchParams<'sort' | 'page'>()
  let sortBy: SortType
  let orderBy: OrderByType = 'asc'
  if (sortParam) {
    const sortEntry = sortParam.split(',')[0]
    const indexOfPoint = sortEntry.indexOf('.')
    if (indexOfPoint < 0) {
      if (isSortByType(sortEntry)) {
        sortBy = sortEntry
      }
    } else {
      const sBy = sortEntry.substring(0, indexOfPoint)
      if (isSortByType(sBy)) {
        sortBy = sBy
        const oBy = sortEntry.substring(indexOfPoint + 1)
        if (isOrderByType(oBy)) {
          orderBy = oBy
        }
      }
    }
  }
  const sort = sortBy ? `${sortBy}.${orderBy}` : undefined

  const handleSortClick = (sortRule?: SortType) => {
    if (sortBy === sortRule) {
      if (orderBy === 'desc') {
        updateSearchParams(params => omit({ ...params, sort: `${sortRule}.asc` }, ['page']), true)
      } else {
        updateSearchParams(params => omit({ ...params, sort: `${sortRule}.desc` }, ['page']), true)
      }
    } else {
      updateSearchParams(params => omit({ ...params, sort: `${sortRule}.desc` }, ['page']), true)
    }
  }

  return { sortBy, orderBy, sort, handleSortClick }
}

export function useUpdateSearchParams<T extends string>(): (
  updater: (current: Partial<Record<T, string>>) => Partial<Record<T, string | null | undefined>>,
  replace?: boolean,
) => void {
  const history = useHistory()
  const { search, pathname, hash } = useLocation()

  return useCallback(
    (updater, replace) => {
      const oldParams: Partial<Record<T, string>> = getSearchParams(search)
      const newParams = omitNil(updater(oldParams))
      const newUrlSearchParams = new URLSearchParams(newParams as Record<string, string>)
      newUrlSearchParams.sort()
      const newQueryString = newUrlSearchParams.toString()
      const to = `${pathname}${newQueryString ? `?${newQueryString}` : ''}${hash}`

      if (replace) {
        history.replace(to)
      } else {
        history.push(to)
      }
    },
    [hash, history, pathname, search],
  )
}

export function usePaginationParamsFromSearch(opts: {
  defaultPage?: number
  maxPage?: number
  defaultPageSize?: number
  maxPageSize?: number
}) {
  const { defaultPage = 1, maxPage = Infinity, defaultPageSize = 10, maxPageSize = 100 } = opts
  const updateSearchParams = useUpdateSearchParams<'page' | 'size'>()
  const params = useSearchParams('page', 'size')
  const currentPage = Number.isNaN(Number(params.page)) ? defaultPage : Number(params.page)
  const pageSize = Number.isNaN(Number(params.size)) ? defaultPageSize : Number(params.size)

  useEffect(() => {
    const pageSizeOversized = pageSize > maxPageSize
    const pageOversized = currentPage > maxPage
    if (pageSizeOversized || pageOversized) {
      updateSearchParams(
        params => ({
          ...params,
          page: pageOversized ? maxPage.toString() : params.page,
          size: pageSizeOversized ? maxPageSize.toString() : params.size,
        }),
        true,
      )
    }
  }, [currentPage, maxPage, maxPageSize, pageSize, updateSearchParams])

  const setPage = useCallback(
    (page: number) =>
      updateSearchParams(params => ({
        ...params,
        page: Math.min(page, maxPage).toString(),
      })),
    [maxPage, updateSearchParams],
  )

  const setPageSize = useCallback(
    (size: number) =>
      updateSearchParams(params => ({
        ...params,
        size: Math.min(size, maxPageSize).toString(),
      })),
    [maxPageSize, updateSearchParams],
  )

  return {
    currentPage: Math.min(currentPage, maxPage),
    pageSize: Math.min(pageSize, maxPageSize),
    setPage,
    setPageSize,
  }
}

// TODO: refactor this hook
export const usePaginationParamsInPage = () =>
  usePaginationParamsFromSearch({
    defaultPage: PageParams.PageNo,
    defaultPageSize: PageParams.PageSize,
    maxPageSize: PageParams.MaxPageSize,
  })

export const usePaginationParamsInListPage = () =>
  usePaginationParamsFromSearch({
    defaultPage: ListPageParams.PageNo,
    defaultPageSize: ListPageParams.PageSize,
    maxPageSize: ListPageParams.MaxPageSize,
  })
