import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import classNames from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import type { NFTCollection } from '../../services/ExplorerService'
import { Link } from '../../components/Link'
import SortButton from '../../components/SortButton'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { ReactComponent as FilterIcon } from './filter.svg'
import { getPrimaryColor } from '../../constants/common'
import { useSearchParams } from '../../hooks'
import styles from './styles.module.scss'
import { useNFTCollectionsSortParam } from './util'
import { parseSimpleDate } from '../../utils/date'
import MultiFilterButton from '../../components/MultiFilterButton'
import NFTTag, { whiteList } from '../../components/NFTTag'
import { Card } from '../../components/Card'
import { FilterSortContainerOnMobile } from '../../components/FilterSortContainer'
import AddressText from '../../components/AddressText'
import { DEPRECATED_DOB_COLLECTION } from '../../constants/marks'
import Annotation from '../../components/Annotation'
import Tooltip from '../../components/Tooltip'
import Popover from '../../components/Popover'

const primaryColor = getPrimaryColor()
function useFilterList(): Record<'title' | 'value', string>[] {
  const { t } = useTranslation()
  return [
    {
      value: 'all',
      title: t('nft.all-type'),
    },
    {
      value: 'm_nft',
      title: t('nft.m_nft'),
    },
    {
      value: 'nrc721',
      title: t('nft.nrc_721'),
    },
    {
      value: 'cota',
      title: t('nft.cota'),
    },
    {
      value: 'spore',
      title: t('nft.dobs'),
    },
  ]
}

const getFilterList = (t: TFunction) =>
  [
    {
      key: 'invalid',
      value: t('xudt.tags.invalid'),
      title: <NFTTag key="invalid" tagName="invalid" />,
      to: '/nft-collections',
    },
    {
      key: 'suspicious',
      value: t('xudt.tags.suspicious'),
      title: <NFTTag key="suspicious" tagName="suspicious" />,
      to: '/nft-collections',
    },
    {
      key: 'out-of-length-range',
      value: t('xudt.tags.out-of-length-range'),
      title: <NFTTag key="out-of-length-range" tagName="out-of-length-range" />,
      to: '/nft-collections',
    },
    {
      key: 'rgb++',
      value: t('xudt.tags.rgb++'),
      title: <NFTTag key="rgb++" tagName="rgb++" />,
      to: '/nft-collections',
    },
    {
      key: 'duplicate',
      value: t('xudt.tags.duplicate'),
      title: <NFTTag key="duplicate" tagName="duplicate" />,
      to: '/nft-collections',
    },
    {
      key: 'layer-1-asset',
      value: t('xudt.tags.layer-1-asset'),
      title: <NFTTag key="layer-1-asset" tagName="layer-1-asset" />,
      to: '/nft-collections',
    },
    {
      key: 'layer-2-asset',
      value: t('xudt.tags.layer-2-asset'),
      title: <NFTTag key="layer-2-asset" tagName="layer-2-asset" />,
      to: '/nft-collections',
    },
    {
      key: 'supply-limited',
      value: t('xudt.tags.supply-limited'),
      title: <NFTTag key="supply-limited" tagName="supply-limited" />,
      to: '/nft-collections',
    },
  ].filter(f => whiteList.includes(f.key))

export const isTxFilterType = (s?: string): boolean => {
  return s ? ['all', 'm_nft', 'nrc721', 'cota', 'spore'].includes(s) : false
}

const TypeFilter = () => {
  const { t } = useTranslation()
  const { type } = useSearchParams('type')
  const isActive = isTxFilterType(type)
  const list = useFilterList()
  return (
    <div className={styles.typeFilter} data-is-active={isActive}>
      {t('nft.standard')}
      <Popover trigger={<FilterIcon className={styles.filter} />}>
        <div className={styles.filterItems}>
          {list.map(f => (
            <Link
              key={f.value}
              to={`/nft-collections?${new URLSearchParams({ type: f.value })}`}
              data-is-active={f.value === type}
            >
              {f.title}
              <SelectedCheckIcon />
            </Link>
          ))}
        </div>
      </Popover>
    </div>
  )
}

const Tags = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.colTags}>
      {t('xudt.title.tags')}
      <MultiFilterButton filterName="tags" key="" filterList={getFilterList(t)} />
    </div>
  )
}

const HolderMinterSort = () => {
  const { t } = useTranslation()
  const sortParam = useNFTCollectionsSortParam()
  const { sortBy, handleSortClick } = sortParam

  return (
    <div className={styles.holderMinted}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'holder',
        })}
        onClick={() => handleSortClick('holder')}
        role="button"
        tabIndex={0}
      >
        {t('nft.holder')}
        {sortBy === 'holder' && <SortButton field="holder" sortParam={sortParam} />}
      </div>
      <span className={styles.divider}>/</span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'minted',
        })}
        onClick={() => handleSortClick('minted')}
        role="button"
        tabIndex={0}
      >
        {t('nft.minted')}
        {sortBy !== 'holder' && <SortButton field="minted" sortParam={sortParam} />}
      </div>
    </div>
  )
}
interface SimpleSortProps {
  sortField: 'transactions' | 'timestamp'
  fieldI18n: string
}
const SimpleSortHeader: React.FC<SimpleSortProps> = ({ sortField, fieldI18n }) => {
  const sortParam = useNFTCollectionsSortParam()
  const { handleSortClick } = sortParam
  return (
    <span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <span onClick={() => handleSortClick(sortField)} role="button" tabIndex={0}>
        {fieldI18n}
      </span>
      <SortButton field={sortField} sortParam={sortParam} />
    </span>
  )
}

const TypeInfo: React.FC<{ nft: NFTCollection }> = ({ nft: item }) => {
  const { t } = useTranslation()
  return t(`glossary.${item.standard}`) ? (
    <Tooltip
      trigger={<span>{t(`nft.${item.standard === 'spore' ? 'dobs' : item.standard}`)}</span>}
      placement="top"
      contentClassName={styles.nftTooltip}
    >
      <Trans
        i18nKey={`glossary.${item.standard}`}
        components={{
          cota_link: (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
            <a
              href="https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338"
              target="_blank"
              rel="noreferrer"
            />
          ),
          m_nft_link: (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
            <a href="https://github.com/nervina-labs/ckb-nft-scripts" target="_blank" rel="noreferrer" />
          ),
        }}
      />
    </Tooltip>
  ) : (
    t(`nft.${item.standard}`)
  )
}

export const ListOnDesktop: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()

  return (
    <table data-role="desktop-list">
      <thead>
        <tr>
          <th>{t('nft.collection_name')}</th>
          <th>
            <Tags />
          </th>
          <th>
            <TypeFilter />
          </th>
          <th className={styles.transactionsHeader}>
            <SimpleSortHeader sortField="transactions" fieldI18n={t('nft.transactions')} />
          </th>
          <th>
            <HolderMinterSort />
          </th>
          <th>
            <SimpleSortHeader sortField="timestamp" fieldI18n={t('nft.created_time')} />
          </th>
          <th>{t('nft.minter_address')}</th>
        </tr>
      </thead>
      <tbody>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
            const itemName: string = item.standard === 'spore' && item.creator === '' ? 'Unique items' : item.name
            try {
              if (item.type_script) {
                typeHash = scriptToHash({
                  codeHash: item.type_script.code_hash,
                  hashType: item.type_script.hash_type,
                  args: item.type_script.args,
                })
              }
            } catch {
              typeHash = item.sn
            }
            const annotation = DEPRECATED_DOB_COLLECTION.find(i => i.id === typeHash)
            return (
              <tr key={item.id}>
                <td>
                  <div className={styles.name}>
                    {item.icon_url ? (
                      <img
                        src={`${patchMibaoImg(item.icon_url)}?size=small`}
                        alt="cover"
                        loading="lazy"
                        className={styles.icon}
                        onError={handleNftImgError}
                      />
                    ) : (
                      <img
                        src={
                          item.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
                        }
                        alt="cover"
                        loading="lazy"
                        className={styles.icon}
                      />
                    )}
                    <Link
                      to={`/nft-collections/${typeHash || item.id}`}
                      title={itemName}
                      style={{
                        color: primaryColor,
                      }}
                    >
                      {itemName}
                    </Link>
                  </div>
                </td>
                <td>
                  <div className={styles.tags}>
                    {annotation ? <Annotation content={annotation.reason} /> : null}
                    {item.tags.map(tag => (
                      <NFTTag key={`${item.id}${item.tags}`} tagName={tag} />
                    ))}
                  </div>
                </td>
                <td>
                  <TypeInfo nft={item} />
                </td>
                <td>{item.h24_ckb_transactions_count}</td>
                <td>{`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                  'en',
                )}`}</td>
                <td>{item.timestamp === null ? '' : parseSimpleDate(item.timestamp)}</td>
                <td>
                  <div>
                    {item.creator ? (
                      <Tooltip
                        trigger={
                          <AddressText
                            style={{ marginLeft: 'auto' }}
                            disableTooltip
                            linkProps={{
                              to: `/address/${item.creator}`,
                            }}
                          >
                            {item.creator}
                          </AddressText>
                        }
                      >
                        {item.creator}
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td colSpan={7} className={styles.noRecord}>
              {isLoading ? 'loading' : t(`nft.no_record`)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export const ListOnMobile: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <FilterSortContainerOnMobile key="nft-collections-sort">
          <TypeFilter />
          <SimpleSortHeader sortField="transactions" fieldI18n={t('nft.transactions')} />
          <HolderMinterSort />
          <SimpleSortHeader sortField="timestamp" fieldI18n={t('nft.created_time')} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', maxWidth: '100%' }}>
            {t('xudt.title.tags')}
            <MultiFilterButton filterName="tags" key="" filterList={getFilterList(t)} />
          </div>
        </FilterSortContainerOnMobile>
      </Card>
      <div>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
            const itemName: string = item.standard === 'spore' && item.creator === '' ? 'Unique items' : item.name
            try {
              if (item.type_script) {
                typeHash = scriptToHash({
                  codeHash: item.type_script.code_hash,
                  hashType: item.type_script.hash_type,
                  args: item.type_script.args,
                })
              }
            } catch {
              // ignore
            }
            const annotation = DEPRECATED_DOB_COLLECTION.find(i => i.id === typeHash)
            return (
              <Card key={item.id} className={styles.tokensCard}>
                <div>
                  <dl className={styles.tokenInfo}>
                    <dt className={styles.title}>Name</dt>
                    <dd>
                      {item.icon_url ? (
                        <img
                          src={`${patchMibaoImg(item.icon_url)}?size=small`}
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                          onError={handleNftImgError}
                        />
                      ) : (
                        <img
                          src={
                            item.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
                          }
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                        />
                      )}
                      <Link to={`/nft-collections/${typeHash || item.id}`} title={itemName} className={styles.link}>
                        {itemName}
                      </Link>
                    </dd>
                  </dl>
                  <div className={styles.name} />
                </div>
                <dl className={styles.tokenInfo}>
                  <dt className={styles.title}>{t(`nft.standard`)}</dt>
                  <dd className={styles.value}>
                    <TypeInfo nft={item} />
                  </dd>
                </dl>

                <dl className={styles.tokenInfo}>
                  <dt>{`${t('nft.holder')}/${t('nft.minted')}`}</dt>
                  <dd>
                    {`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                      'en',
                    )}`}
                  </dd>
                </dl>
                <dl className={styles.tokenInfo}>
                  <dt>{t('nft.transactions')}</dt>
                  <dd>{item.h24_ckb_transactions_count}</dd>
                </dl>
                <dl className={styles.tokenInfo}>
                  <dt>{t('nft.created_time')}</dt>
                  <dd>{item.timestamp === null ? '' : parseSimpleDate(item.timestamp)}</dd>
                </dl>
                {item.creator ? (
                  <dl className={styles.tokenInfo}>
                    <dt>{t(`nft.minter_address`)}</dt>
                    <dd>
                      <Tooltip
                        trigger={
                          <Link
                            to={`/address/${item.creator}`}
                            className="monospace"
                            style={{
                              color: primaryColor,
                              fontWeight: 500,
                            }}
                          >{`${item.creator.slice(0, 8)}...${item.creator.slice(-8)}`}</Link>
                        }
                      >
                        {item.creator}
                      </Tooltip>
                    </dd>
                  </dl>
                ) : null}
                <dl className={styles.tokenInfo} style={{ flexDirection: 'row' }}>
                  {annotation ? <Annotation content={annotation.reason} /> : null}
                  {item.tags.map(tag => (
                    <NFTTag tagName={tag} />
                  ))}
                </dl>
              </Card>
            )
          })
        ) : (
          <div className={styles.noRecord}>{isLoading ? 'loading' : t(`nft.no_record`)}</div>
        )}
      </div>
    </>
  )
}
