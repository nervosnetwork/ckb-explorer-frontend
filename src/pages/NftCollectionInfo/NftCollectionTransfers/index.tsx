import { FC, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { getImgFromSporeCell } from '../../../utils/spore'
// TODO: Refactor is needed. Should not directly import anything from the descendants of ExplorerService.
import type { TransferListRes, TransferRes } from '../../../services/ExplorerService/fetcher'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../../constants/common'
import { formatNftDisplayId, handleNftImgError, hexToBase64, patchMibaoImg } from '../../../utils/util'
import { explorerService } from '../../../services/ExplorerService'
import { dayjs } from '../../../utils/date'
import { useParsedDate, useTimestamp } from '../../../hooks'
import { useCurrentLanguage } from '../../../utils/i18n'

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

const TransferTable: FC<TransferCollectionProps> = ({ standard, collection, iconURL, list, isLoading }) => {
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
            <TransferTableRow
              key={item.id}
              collection={collection}
              item={item}
              iconURL={iconURL}
              isShowInAge={isShowInAge}
            />
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
  iconURL?: string | null
  isShowInAge?: boolean
}> = ({ collection, item, iconURL, isShowInAge }) => {
  const { t } = useTranslation()
  let coverUrl = item.item.icon_url ?? iconURL
  if (item.item.standard === 'spore' && item.item.cell?.data) {
    coverUrl = getImgFromSporeCell(item.item.cell.data)
  }
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)
  const now = useTimestamp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeRelativeBlockCreate = useMemo(() => dayjs(item.transaction.block_timestamp).fromNow(), [now])

  const renderCover = () => {
    const cell = item.item?.cell
    const standard = item.item?.standard

    if (item.item.dob) {
      const { dob } = item.item
      const src = dob.asset?.startsWith('0x')
        ? `data:${dob.media_type};base64,${hexToBase64(dob.asset.slice(2))}`
        : dob.asset

      return (
        <img
          src={src}
          alt="cover"
          loading="lazy"
          className={styles.icon}
          style={{
            background: dob['prev.bgcolor'] ?? 'transparent',
            padding: 2,
          }}
        />
      )
    }

    if (standard === 'spore' && cell && cell.data) {
      const img = getImgFromSporeCell(cell.data)
      return <img src={img} alt="cover" loading="lazy" className={styles.icon} />
    }

    if (coverUrl) {
      return (
        <img
          data-protocol={standard}
          src={`${patchMibaoImg(coverUrl)}?size=small&tid=${item.item.token_id}`}
          alt="cover"
          loading="lazy"
          className={styles.icon}
          onError={handleNftImgError}
        />
      )
    }

    return <img src="/images/nft_placeholder.png" alt="cover" loading="lazy" className={styles.icon} />
  }

  return (
    <tr>
      <td>
        <div className={styles.item}>
          {renderCover()}
          <Link
            to={`/nft-info/${collection}/${item.item.token_id}`}
            style={{
              color: primaryColor,
            }}
            className={styles.tokenId}
          >
            {`id: ${formatNftDisplayId(item.item.token_id, item.item.standard)}`}
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
          <Tooltip title={item.transaction.tx_hash}>
            <span className="monospace">
              {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
            </span>
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
            <Tooltip title={item.from}>
              <span className="monospace">{`${item.from.slice(0, 8)}...${item.from.slice(-8)}`}</span>
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
            <Tooltip title={item.to}>
              <span className="monospace">{`${item.to.slice(0, 8)}...${item.to.slice(-8)}`}</span>
            </Tooltip>
          </Link>
        ) : (
          '-'
        )}
      </td>
    </tr>
  )
}

const TransferCardGroup: FC<TransferCollectionProps> = ({ collection, iconURL, list, isLoading }) => {
  const { t } = useTranslation()
  return (
    <ul>
      {list.length ? (
        list.map(item => <TransferCard key={item.id} collection={collection} item={item} iconURL={iconURL} />)
      ) : (
        <li className={styles.noRecord}>{isLoading ? t('nft.loading') : t(`nft.no_record`)}</li>
      )}
    </ul>
  )
}

const TransferCard: FC<{
  collection: string
  item: TransferRes
  iconURL?: string | null
}> = ({ collection, item, iconURL }) => {
  const { t } = useTranslation()
  const coverUrl = item.item.icon_url ?? iconURL
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)

  const renderCover = () => {
    const cell = item.item?.cell
    const standard = item.item?.standard

    if (item.item?.dob) {
      const { dob } = item.item
      const src = dob.asset?.startsWith('0x')
        ? `data:${dob.media_type};base64,${hexToBase64(dob.asset.slice(2))}`
        : dob.asset

      return (
        <img
          src={src}
          alt="cover"
          loading="lazy"
          className={styles.icon}
          style={{
            background: dob['prev.bgcolor'] ?? 'transparent',
          }}
        />
      )
    }

    if (standard === 'spore' && cell && cell.data) {
      const img = getImgFromSporeCell(cell.data)
      return <img src={img} alt="cover" loading="lazy" className={styles.icon} />
    }

    if (coverUrl) {
      return (
        <img
          src={`${patchMibaoImg(coverUrl)}?size=small&tid=${item.item.token_id}`}
          alt="cover"
          loading="lazy"
          className={styles.icon}
          onError={handleNftImgError}
        />
      )
    }

    return <img src="/images/nft_placeholder.png" alt="cover" loading="lazy" className={styles.icon} />
  }

  return (
    <li>
      <div className={styles.item}>
        {renderCover()}
        <Link
          to={`/nft-info/${collection}/${item.item.token_id}`}
          style={{
            color: primaryColor,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {`id: ${formatNftDisplayId(item.item.token_id, item.item.standard)}`}
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
              <Tooltip title={item.transaction.tx_hash}>
                <span className="monospace">
                  {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
                </span>
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
                <Tooltip title={item.from}>
                  <span className="monospace">{`${item.from.slice(0, 10)}...${item.from.slice(-10)}`}</span>
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
                <Tooltip title={item.to}>
                  <span className="monospace">{`${item.to.slice(0, 10)}...${item.to.slice(-10)}`}</span>
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
