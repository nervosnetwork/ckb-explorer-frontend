import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { AggregateSearchResult } from '../../services/ExplorerService'
import { SearchResultItem } from '../Search/AggregateSearchResults'

const ResultItem = forwardRef(
  (
    {
      result,
      active,
      keyword,
    }: {
      result: AggregateSearchResult
      active: boolean
      keyword: string
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={cn('px-3 py-2 flex justify-between items-center cursor-pointer border-l-4', {
          'border-transparent': !active,
          'border-gray-300': active,
          'bg-gray-100': active,
          '[&_*]:bg-inherit!': true,
        })}
      >
        <SearchResultItem item={result} keyword={keyword} highlightedWhenHover={false} />
      </div>
    )
  },
)

export default ResultItem
