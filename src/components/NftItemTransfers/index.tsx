import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import i18n from '../../utils/i18n'
import { getPrimaryColor } from '../../constants/common'
import { dayjs, parseDate } from '../../utils/date'
import styles from './styles.module.scss'

const primaryColor = getPrimaryColor()

export interface TransferListRes {
  data: Array<{
    id: number
    from: string | null
    to: string | null
    action: 'mint' | 'normal' | 'destruction'
    item: {
      id: number
      collection_id: number
      token_id: string
      name: string | null
      icon_url: string | null
      owner_id: number
      metadata_url: string | null
      cell_id: number | null
    }
    transaction: {
      tx_hash: string
      block_number: number
      block_timestamp: number
    }
  }>
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}
const NftItemTransfers: React.FC<{ list: TransferListRes['data']; isLoading: boolean }> = ({ list, isLoading }) => {
  const [isShowInAge, setIsShowInAge] = useState(false)
  dayjs.locale(i18n.language === 'zh' ? 'zh-cn' : 'en')

  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
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
            list.map(item => {
              return (
                <tr key={item.id}>
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
                  <td>
                    {isShowInAge
                      ? dayjs(item.transaction.block_timestamp).fromNow()
                      : parseDate(item.transaction.block_timestamp)}
                  </td>
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
            })
          ) : (
            <tr>
              <td colSpan={5} className={styles.noRecord}>
                {isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ul>
        {list.length ? (
          list.map(item => (
            <li key={item.id}>
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
                  <dd>{parseDate(item.transaction.block_timestamp)}</dd>
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
          ))
        ) : (
          <li>{isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}</li>
        )}
      </ul>
    </div>
  )
}

NftItemTransfers.displayName = 'NftTransfers'

export default NftItemTransfers
