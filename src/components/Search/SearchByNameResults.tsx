/* eslint-disable react/destructuring-assignment */
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC } from 'react'
import { UDTQueryResult } from '../../services/ExplorerService/fetcher'
import styles from './SearchByNameResults.module.scss'
import EllipsisMiddle from '../EllipsisMiddle'
import SmallLoading from '../Loading/SmallLoading'
import { Link } from '../Link'

type Props = {
  keyword?: string
  loading?: boolean
  udtQueryResults: UDTQueryResult[]
}

export const SearchByNameResults: FC<Props> = ({ keyword = '', udtQueryResults, loading }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.searchResultsPanelWrapper}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <SmallLoading className={styles.loadingWrapper} />
      ) : udtQueryResults.length === 0 ? (
        <div className={styles.empty}>{t('search.no_search_result')}</div>
      ) : (
        udtQueryResults.map(item => <SearchByNameResult keyword={keyword} key={item.typeHash} item={item} />)
      )}
    </div>
  )
}

const SearchByNameResult: FC<{ keyword?: string; item: UDTQueryResult }> = ({ item, keyword = '' }) => {
  const { t } = useTranslation()
  const { typeHash, fullName, symbol, udtType } = item
  const displayName = symbol ?? fullName

  const HighlightText = (text: string, keyword: string) => {
    const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase())
    if (keywordIndex === -1) return text
    const startIndex = Math.max(0, keywordIndex - 1)
    const keywordLength = Math.min(keyword.length, 5)
    const preLength = startIndex
    const afterLength = text.length - (keywordLength + 1 + keywordIndex)
    const sideChar = Math.min(Math.max(1, 5 - keywordLength), 3)
    return (
      <span className={styles.highlightText} style={{ maxWidth: 'min(200px, 60%)' }}>
        <span>
          {text.slice(0, preLength > sideChar ? sideChar : startIndex)}
          {preLength > sideChar ? '...' : ''}
        </span>
        <span style={{ textOverflow: 'clip' }}>
          {text.slice(startIndex, keywordIndex)}
          <span className={styles.highlight}>{text.slice(keywordIndex, keywordIndex + keywordLength)}</span>
          {text.slice(keywordIndex + keywordLength, keywordIndex + keywordLength + 1)}
        </span>
        <span>
          {afterLength > sideChar ? '...' : ''}
          {text.slice(afterLength > sideChar ? -sideChar : keywordIndex + keywordLength + 1)}
        </span>
      </span>
    )
  }

  return (
    <Link
      className={styles.searchResult}
      to={`/${udtType === 'omiga_inscription' ? 'inscription' : 'sudt'}/${typeHash}`}
    >
      <div className={styles.content}>
        {!displayName ? t('udt.unknown_token') : HighlightText(displayName, keyword)}
        <EllipsisMiddle
          className={classNames(styles.typeHash, 'monospace')}
          style={{ maxWidth: 'min(200px, 40%)' }}
          useTextWidthForPlaceholderWidth
          title={typeHash}
        >
          {typeHash}
        </EllipsisMiddle>
      </div>
    </Link>
  )
}
