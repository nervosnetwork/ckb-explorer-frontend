import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC } from 'react'
import { UDTQueryResult } from '../../services/ExplorerService/fetcher'
import styles from './SearchByNameResults.module.scss'
import EllipsisMiddle from '../EllipsisMiddle'
import SmallLoading from '../Loading/SmallLoading'
import { Link } from '../Link'

type Props = {
  loading?: boolean
  udtQueryResults: UDTQueryResult[]
}

export const SearchByNameResults: FC<Props> = ({ udtQueryResults, loading }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.searchResultsPanelWrapper}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <SmallLoading className={styles.loadingWrapper} />
      ) : udtQueryResults.length === 0 ? (
        <div className={styles.empty}>{t('search.no_search_result')}</div>
      ) : (
        udtQueryResults.map(item => <SearchByNameResult key={item.typeHash} item={item} />)
      )}
    </div>
  )
}

const SearchByNameResult: FC<{ item: UDTQueryResult }> = ({ item }) => {
  const { t } = useTranslation()
  const { typeHash, fullName, symbol, udtType } = item
  const displayName = symbol ?? fullName

  return (
    <Link
      className={styles.searchResult}
      to={`/${udtType === 'omiga_inscription' ? 'inscription' : 'sudt'}/${typeHash}`}
    >
      <div className={styles.content}>
        {/* TODO: Need to implement highlighting for the matched keywords. */}
        <EllipsisMiddle
          className={styles.tokenSymbol}
          style={{ maxWidth: 'min(180px, 40%)' }}
          useTextWidthForPlaceholderWidth
          title={displayName}
        >
          {displayName ?? t('udt.unknown_token')}
        </EllipsisMiddle>
        <EllipsisMiddle
          className={classNames(styles.typeHash, 'monospace')}
          style={{ maxWidth: 'min(200px, 60%)' }}
          useTextWidthForPlaceholderWidth
          title={typeHash}
        >
          {typeHash}
        </EllipsisMiddle>
      </div>
    </Link>
  )
}
