import type { AxiosResponse } from 'axios'
import { FC, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import { Base64 } from 'js-base64'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { parseSporeCellData } from '../../utils/spore'
import type { TransferListRes, TransferRes } from '../../pages/NftCollectionInfo'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { explorerService } from '../../services/ExplorerService'
import { dayjs } from '../../utils/date'
import { useParsedDate, useTimestamp } from '../../utils/hook'

const primaryColor = getPrimaryColor()

interface TransferCollectionProps {
  collection: string
  iconURL?: string | null
  list: TransferListRes['data']
  isLoading: boolean
}

const NftCollectionTransfers: FC<TransferCollectionProps> = props => {
  const { collection } = props

  const { data: info } = useQuery<AxiosResponse<{ icon_url: string | null }>>(['collection-info', collection], () =>
    explorerService.api.requesterV2(`nft/collections/${collection}`),
  )

  return (
    <div className={styles.list}>
      <TransferTable {...props} iconURL={info?.data.icon_url} />
      <TransferCardGroup {...props} iconURL={info?.data.icon_url} />
    </div>
  )
}
NftCollectionTransfers.displayName = 'NftTransfers'

const TransferTable: FC<TransferCollectionProps> = ({ collection, iconURL, list, isLoading }) => {
  const [isShowInAge, setIsShowInAge] = useState(false)

  dayjs.locale(i18n.language === 'zh' ? 'zh-cn' : 'en')

  return (
    <table>
      <thead>
        <tr>
          <th>{i18n.t('nft.nft')}</th>
          <th>{i18n.t('nft.tx_hash')}</th>
          <th>{i18n.t('nft.action')}</th>
          <th>
            <span
              role="presentation"
              onClick={() => setIsShowInAge(show => !show)}
              className={styles.age}
              title={i18n.t('nft.toggle-age')}
              style={{
                color: primaryColor,
              }}
            >
              {i18n.t('nft.age')}
            </span>
          </th>
          <th>{i18n.t('nft.from')}</th>
          <th>{i18n.t('nft.to')}</th>
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
              {isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}
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
  const coverUrl = item.item.icon_url ?? iconURL
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)
  const now = useTimestamp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeRelativeBlockCreate = useMemo(() => dayjs(item.transaction.block_timestamp).fromNow(), [now])

  const renderCover = () => {
    const cell = item.item?.cell
    const standard = item.item?.standard

    if (standard === 'spore' && cell && cell.data) {
      const sporeData = parseSporeCellData(cell.data)
      if (sporeData.contentType.slice(0, 5) === 'image') {
        const base64data = Base64.fromUint8Array(hexToBytes(`0x${sporeData.content}`))

        return (
          <img
            src={`data:${sporeData.contentType};base64,${base64data}`}
            alt="cover"
            loading="lazy"
            className={styles.icon}
          />
        )
      }
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
            {`id: ${item.item.token_id}`}
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
      <td>{i18n.t(`nft.action_type.${item.action}`)}</td>
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
  return (
    <ul>
      {list.length ? (
        list.map(item => <TransferCard key={item.id} collection={collection} item={item} iconURL={iconURL} />)
      ) : (
        <li className={styles.noRecord}>{isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}</li>
      )}
    </ul>
  )
}

const TransferCard: FC<{
  collection: string
  item: TransferRes
  iconURL?: string | null
}> = ({ collection, item, iconURL }) => {
  const coverUrl = item.item.icon_url ?? iconURL
  const parsedBlockCreateAt = useParsedDate(item.transaction.block_timestamp)

  const renderCover = () => {
    const cell = item.item?.cell
    const standard = item.item?.standard

    if (standard === 'spore' && cell && cell.data) {
      const sporeData = parseSporeCellData(cell.data)
      if (sporeData.contentType.slice(0, 5) === 'image') {
        const base64data = Base64.fromUint8Array(hexToBytes(`0x${sporeData.content}`))

        return (
          <img
            src={`data:${sporeData.contentType};base64,${base64data}`}
            alt="cover"
            loading="lazy"
            className={styles.icon}
          />
        )
      }
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
          {`id: ${item.item.token_id}`}
        </Link>
      </div>
      <dl>
        <div>
          <dt>{i18n.t('nft.tx_hash')}</dt>
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
          <dt>{i18n.t('nft.action')}</dt>
          <dd>{i18n.t(`nft.action_type.${item.action}`)}</dd>
        </div>
        <div>
          <dt>{i18n.t('nft.age')}</dt>
          <dd>{parsedBlockCreateAt}</dd>
        </div>
        <div>
          <dt>{i18n.t('nft.from')}</dt>
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
          <dt>{i18n.t('nft.to')}</dt>
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
