import { FC, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
// TODO: Refactor is needed. Should not directly import anything from the descendants of ExplorerService.
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../../constants/common'
import { formatNftDisplayId } from '../../../utils/util'
import { type TransferListRes, TransferRes, explorerService } from '../../../services/ExplorerService'
import { dayjs } from '../../../utils/date'
import { useParsedDate, useTimestamp } from '../../../hooks'
import { useCurrentLanguage } from '../../../utils/i18n'
import Cover from '../ItemCover'
import Tooltip from '../../../components/Tooltip'

const primaryColor = getPrimaryColor()

/* eslint-disable react/no-unused-prop-types */
interface TransferCollectionProps {
  collection: string
  iconURL?: string | null
  list: TransferListRes['data']
  isLoading: boolean
  standard?: string
}

const NftCollectionTransfers: FC<TransferCollectionProps> = props => {
  const { collection } = props

  const { data: info } = useQuery(['collection-info', collection], () =>
    explorerService.api.fetchNFTCollection(collection),
  )

  return (
    <div className={styles.list}>
      <TransferTable {...props} standard={info?.standard} iconURL={info?.icon_url} />
      <TransferCardGroup {...props} iconURL={info?.icon_url} />
    </div>
  )
}
NftCollectionTransfers.displayName = 'NftTransfers'

const TransferTable: FC<TransferCollectionProps> = ({ standard, collection, list, isLoading }) => {
  const [isShowInAge, setIsShowInAge] = useState(false)
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  dayjs.locale(currentLanguage === 'zh' ? 'zh-cn' : 'en')

  return (
    <table>
      <thead>
        <tr>
          <th>{t(`nft.${standard === 'spore' ? 'dob' : 'nft'}`)}</th>
          <th>{t('nft.tx_hash')}</th>
          <th>{t('nft.action')}</th>
          <th>
            <span
              role="presentation"
              onClick={() => setIsShowInAge(show => !show)}
              className={styles.age}
              title={t('nft.toggle-age')}
              style={{
                color: primaryColor,
              }}
            >
              {t('nft.age')}
            </span>
          </th>
          <th>{t('nft.from')}</th>
          <th>{t('nft.to')}</th>
        </tr>
      </thead>
      <tbody>
        {list.length ? (
          list.map(item => (
            <TransferTableRow key={item.id} collection={collection} item={item} isShowInAge={isShowInAge} />
          ))
        ) : (
          <tr>
            <td colSpan={6} className={styles.noRecord}>
              {isLoading ? t('nft.loading') : t(`nft.no_record`)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

const TransferTableRow: FC<{
  collection: string
  item: TransferRes
  isShowInAge?: boolean
}> = ({ collection, item, isShowInAge }) => {
  const { t } = useTranslation()
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)
  const now = useTimestamp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeRelativeBlockCreate = useMemo(() => dayjs(item.transaction.block_timestamp).fromNow(), [now])

  const itemId = formatNftDisplayId(item.item.token_id, item.item.standard)

  return (
    <tr>
      <td>
        <div className={styles.item}>
          <Cover item={item.item} size="sm" />
          <Link
            to={`/nft-info/${collection}/${itemId}`}
            style={{
              color: primaryColor,
            }}
            className={styles.tokenId}
          >
            {`id: ${itemId}`}
          </Link>
        </div>
      </td>
      <td>
        <Link
          to={`/transaction/${item.transaction.tx_hash}`}
          title={item.transaction.tx_hash}
          style={{
            color: primaryColor,
            fontWeight: 700,
          }}
        >
          <Tooltip
            trigger={
              <span className="monospace">
                {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
              </span>
            }
          >
            {item.transaction.tx_hash}
          </Tooltip>
        </Link>
      </td>
      <td>{t(`nft.action_type.${item.action}`)}</td>
      <td>{isShowInAge ? timeRelativeBlockCreate : parsedBlockCreateAt}</td>
      <td>
        {item.from ? (
          <Link
            to={`/address/${item.from}`}
            style={{
              color: primaryColor,
              fontWeight: 700,
            }}
          >
            <Tooltip trigger={<span className="monospace">{`${item.from.slice(0, 8)}...${item.from.slice(-8)}`}</span>}>
              {item.from}
            </Tooltip>
          </Link>
        ) : (
          '-'
        )}
      </td>
      <td>
        {item.to ? (
          <Link
            to={`/address/${item.to}`}
            style={{
              color: primaryColor,
              fontWeight: 700,
            }}
          >
            <Tooltip trigger={<span className="monospace">{`${item.to.slice(0, 8)}...${item.to.slice(-8)}`}</span>}>
              {item.to}
            </Tooltip>
          </Link>
        ) : (
          '-'
        )}
      </td>
    </tr>
  )
}

const TransferCardGroup: FC<TransferCollectionProps> = ({ collection, list, isLoading }) => {
  const { t } = useTranslation()
  return (
    <ul>
      {list.length ? (
        list.map(item => <TransferCard key={item.id} collection={collection} item={item} />)
      ) : (
        <li className={styles.noRecord}>{isLoading ? t('nft.loading') : t(`nft.no_record`)}</li>
      )}
    </ul>
  )
}

const TransferCard: FC<{
  collection: string
  item: TransferRes
}> = ({ collection, item }) => {
  const { t } = useTranslation()
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)

  const itemId = formatNftDisplayId(item.item.token_id, item.item.standard)

  return (
    <li>
      <div className={styles.item}>
        <Cover item={item.item} size="sm" />
        <Link
          to={`/nft-info/${collection}/${itemId}`}
          style={{
            color: primaryColor,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {`id: ${itemId}`}
        </Link>
      </div>
      <dl>
        <div>
          <dt>{t('nft.tx_hash')}</dt>
          <dd>
            <Link
              to={`/transaction/${item.transaction.tx_hash}`}
              title={item.transaction.tx_hash}
              style={{
                color: primaryColor,
                fontWeight: 700,
              }}
            >
              <Tooltip
                trigger={
                  <span className="monospace">
                    {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
                  </span>
                }
              >
                {item.transaction.tx_hash}
              </Tooltip>
            </Link>
          </dd>
        </div>
        <div>
          <dt>{t('nft.action')}</dt>
          <dd>{t(`nft.action_type.${item.action}`)}</dd>
        </div>
        <div>
          <dt>{t('nft.age')}</dt>
          <dd>{parsedBlockCreateAt}</dd>
        </div>
        <div>
          <dt>{t('nft.from')}</dt>
          <dd>
            {item.from ? (
              <Link
                to={`/address/${item.from}`}
                style={{
                  color: primaryColor,
                  fontWeight: 700,
                }}
              >
                <Tooltip
                  trigger={<span className="monospace">{`${item.from.slice(0, 10)}...${item.from.slice(-10)}`}</span>}
                >
                  {item.from}
                </Tooltip>
              </Link>
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div>
          <dt>{t('nft.to')}</dt>
          <dd>
            {item.to ? (
              <Link
                to={`/address/${item.to}`}
                style={{
                  color: primaryColor,
                  fontWeight: 700,
                }}
              >
                <Tooltip
                  trigger={<span className="monospace">{`${item.to.slice(0, 10)}...${item.to.slice(-10)}`}</span>}
                >
                  {item.to}
                </Tooltip>
              </Link>
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
    </li>
  )
}

export default NftCollectionTransfers
