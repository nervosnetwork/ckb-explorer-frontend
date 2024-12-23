/* eslint-disable react/destructuring-assignment */
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { SearchResultType, AggregateSearchResult } from '../../services/ExplorerService'
import { getURLByAggregateSearchResult, getDisplayNameByAggregateSearchResult } from './utils'
import { HighlightText } from './HighlightText'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import styles from './AggregateSearchResults.module.scss'
import EllipsisMiddle from '../EllipsisMiddle'
import SmallLoading from '../Loading/SmallLoading'
import { Link } from '../Link'

type Props = {
  keyword?: string
  loading?: boolean
  results: AggregateSearchResult[]
}

export const AggregateSearchResults: FC<Props> = ({ keyword = '', results, loading }) => {
  const { t } = useTranslation()
  const [activatedCategory, setActivatedCategory] = useState<SearchResultType | undefined>(undefined)

  useEffect(() => {
    setActivatedCategory(undefined)
  }, [results])

  const categories = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<SearchResultType, AggregateSearchResult[]>)

  const SearchResultCategoryPanel = (() => {
    return (
      <div className={styles.searchResultCategory}>
        {Object.entries(categories)
          .filter(([type]) => (activatedCategory === undefined ? true : activatedCategory === type))
          .map(([type, items]) => (
            <div key={type} className={styles.category}>
              <div className={styles.categoryTitle}>{t(`search.${type}`)}</div>
              <div className={styles.categoryList}>
                {items.map(item => (
                  <SearchResultItem keyword={keyword} key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
      </div>
    )
  })()

  return (
    <div className={styles.searchResultsPanelWrapper} data-role="search-result-list">
      {!loading && Object.keys(categories).length > 0 && (
        <div className={styles.searchCategoryFilter}>
          {(Object.keys(categories) as SearchResultType[]).map(category => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              key={category}
              className={classNames(styles.searchCategoryTag, { [styles.active]: activatedCategory === category })}
              onClick={() => setActivatedCategory(pre => (pre === category ? undefined : category))}
            >
              {t(`search.${category}`)} {`(${categories[category].length})`}
            </div>
          ))}
        </div>
      )}
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <SmallLoading className={styles.loadingWrapper} />
      ) : results.length === 0 ? (
        <div className={styles.empty}>{t('search.no_search_result')}</div>
      ) : (
        SearchResultCategoryPanel
      )}
    </div>
  )
}

const SearchResultItem: FC<{ keyword?: string; item: AggregateSearchResult }> = ({ item, keyword = '' }) => {
  const { t } = useTranslation()
  const displayName = getDisplayNameByAggregateSearchResult(item)?.toString()
  const to = getURLByAggregateSearchResult(item)
  if (!to) return null

  if (item.type === SearchResultType.UDT) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.boxContent}>
          <div style={{ display: 'flex', width: '100%' }}>
            {!item.attributes.symbol ? (
              t('udt.unknown_token')
            ) : (
              <HighlightText text={item.attributes.symbol} keyword={keyword} style={{ flex: 2, marginRight: 4 }} />
            )}
            {item.attributes.fullName && (
              <span className={classNames(styles.secondaryText, styles.subTitle)} style={{ flex: 1 }}>
                (<HighlightText text={item.attributes.fullName} keyword={keyword} style={{ width: '100%' }} />)
              </span>
            )}
          </div>

          <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
            <span style={{ marginRight: 4, flexShrink: 0 }}>type hash: </span>
            <HighlightText style={{ width: '100%' }} text={item.attributes.typeHash} keyword={keyword} />
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.TokenCollection) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.content}>
          {item.attributes.iconUrl ? (
            <img
              src={`${patchMibaoImg(item.attributes.iconUrl)}?size=small`}
              alt="cover"
              loading="lazy"
              className={styles.icon}
              onError={handleNftImgError}
            />
          ) : (
            <img
              src={
                item.attributes.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
              }
              alt="cover"
              loading="lazy"
              className={styles.icon}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            {!displayName ? (
              t('udt.unknown_token')
            ) : (
              <HighlightText text={displayName} keyword={keyword} style={{ flex: 1 }} />
            )}

            <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
              <span style={{ marginRight: 4, flexShrink: 0 }}>sn: </span>
              <HighlightText style={{ width: '100%' }} text={item.attributes.sn} keyword={keyword} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.TokenItem) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.content}>
          {item.attributes.iconUrl ? (
            <img
              src={`${patchMibaoImg(item.attributes.tokenCollection.iconUrl)}?size=small`}
              alt="cover"
              loading="lazy"
              className={styles.icon}
              onError={handleNftImgError}
            />
          ) : (
            <img
              src={
                item.attributes.tokenCollection.standard === 'spore'
                  ? '/images/spore_placeholder.svg'
                  : '/images/nft_placeholder.png'
              }
              alt="cover"
              loading="lazy"
              className={styles.icon}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            {!displayName ? (
              t('udt.unknown_token')
            ) : (
              <HighlightText text={displayName} keyword={keyword} style={{ flex: 1 }} />
            )}

            <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
              <span style={{ marginRight: 4, flexShrink: 0 }}>sn: </span>
              <HighlightText style={{ width: '100%' }} text={item.attributes.tokenCollection.sn} keyword={keyword} />
            </div>

            <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
              <span style={{ marginRight: 4, flexShrink: 0 }}>tokenId: </span>
              <HighlightText style={{ width: '100%' }} text={item.attributes.tokenId} keyword={keyword} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.DID) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.content}>
          <HighlightText
            style={{ maxWidth: 'min(200px, 60%)', marginRight: 8 }}
            text={item.attributes.did}
            keyword={keyword}
          />
          <EllipsisMiddle
            className={classNames(styles.secondaryText, 'monospace')}
            style={{ maxWidth: 'min(200px, 40%)' }}
            useTextWidthForPlaceholderWidth
            title={item.attributes.address}
          >
            {item.attributes.address}
          </EllipsisMiddle>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.BtcTx) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.boxContent}>
          <div className={classNames(styles.subTitle)}>
            <HighlightText
              text={item.attributes.ckbTransactionHash}
              keyword={keyword}
              style={{ flex: 1, marginRight: 4 }}
            />
            <span className={styles.rgbPlus}>RGB++</span>
          </div>
          <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
            <span style={{ marginRight: 4, flexShrink: 0 }}>btc id:</span>
            <HighlightText style={{ width: '100%' }} text={item.attributes.txid} keyword={keyword} />
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.Transaction) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.boxContent}>
          <HighlightText style={{ width: '100%' }} text={item.attributes.transactionHash} keyword={keyword} />

          <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
            <span style={{ marginRight: 4, flexShrink: 0 }}>
              {t('search.block')} # {localeNumberString(item.attributes.blockNumber)}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.FiberGraphNode) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.boxContent}>
          <HighlightText style={{ width: '100%' }} text={item.attributes.nodeId} keyword={keyword} />

          <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
            <span style={{ marginRight: 4, flexShrink: 0 }}>
              {t('search.fiber_graph_node')} # {localeNumberString(item.attributes.alias)}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link className={styles.searchResult} to={to}>
      <div className={styles.content}>
        {!displayName ? (
          t('udt.unknown_token')
        ) : (
          <HighlightText style={{ width: '100%' }} text={displayName} keyword={keyword} />
        )}
      </div>
    </Link>
  )
}
