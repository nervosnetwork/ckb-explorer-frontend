import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Dispatch, FC, SetStateAction } from 'react'
import { KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarResults, KBarProvider } from 'kbar'
import { useSearch } from '../Search/useSearch'
import { AggregateSearchResult, SearchResultType } from '../../services/ExplorerService'
import ResultItem from './ResultItem'
import { getDisplayNameByAggregateSearchResult, getURLByAggregateSearchResult } from '../Search/utils'

const KBarContent: FC<{ setOpenCount: Dispatch<SetStateAction<number>> }> = ({ setOpenCount }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { keyword, searchValue, setKeyword, isFetching, restQueryState, aggregateSearchResults } = useSearch({
    content: '',
    onEditEnd: () => {},
    onClear: () => {},
    debounceTime: 500,
  })

  const categories = (aggregateSearchResults ?? []).reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<SearchResultType, AggregateSearchResult[]>)

  const content = (() => {
    if (isFetching && !restQueryState.isRefetching) {
      return (
        <div className="flex justify-center items-center py-4 text-lg w-full">
          <Loader2 className="animate-spin text-gray-300" />
        </div>
      )
    }
    if (aggregateSearchResults && aggregateSearchResults.length === 0 && !!searchValue) {
      return <div className="px-3 py-4 text-sm w-full text-gray-400 text-center">{t('search.no_search_result')}</div>
    }
    return (
      <KBarResults
        key={keyword}
        items={Object.entries(categories)
          .map(([type, items]) => [
            type,
            ...items.map(item => ({
              name: getDisplayNameByAggregateSearchResult(item) ?? '',
              ...item,
              id: String(item.id),
              command: {
                perform: () => {
                  const url = getURLByAggregateSearchResult(item)
                  if (url) {
                    history.push(url)
                  }
                },
              },
            })),
          ])
          .flat()}
        onRender={({ item, active }) => {
          return typeof item === 'string' ? (
            <div className="px-3 py-2 uppercase text-sm text-gray-500 font-bold">{item}</div>
          ) : (
            <ResultItem result={item as unknown as AggregateSearchResult} active={active} keyword={keyword} />
          )
        }}
      />
    )
  })()

  return (
    <KBarProvider options={{ enableHistory: false, callbacks: { onClose: () => setOpenCount(prev => prev + 1) } }}>
      <KBarPortal container={document.body}>
        <KBarPositioner className="z-1">
          <KBarAnimator className="max-w-[600px] w-full bg-white text-foreground rounded-lg overflow-hidden shadow-lg">
            <KBarSearch
              className="px-3 py-4 text-lg w-full"
              onChange={e => setKeyword(e.target.value)}
              defaultPlaceholder={t('navbar.search_placeholder')}
            />
            {content}
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  )
}

export default KBarContent
