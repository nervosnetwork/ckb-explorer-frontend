import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import type { TransferListRes } from '../../pages/NftCollectionInfo'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'
import { parseDate } from '../../utils/date'

const primaryColor = getPrimaryColor()

const NftCollectionTransfers: React.FC<{ list: TransferListRes['data']; isLoading: boolean }> = ({
  list,
  isLoading,
}) => {
  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
            <th>{i18n.t('nft.nft')}</th>
            <th>{i18n.t('nft.tx_hash')}</th>
            <th>{i18n.t('nft.age')}</th>
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
                    <div className={styles.item}>
                      {item.item.icon_url ? (
                        <img src={item.item.icon_url} alt="cover" loading="lazy" className={styles.icon} />
                      ) : (
                        <div className={styles.defaultIcon}>{item.id}</div>
                      )}
                      {`id: ${item.id}`}
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
                        {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
                      </Tooltip>
                    </Link>
                  </td>
                  <td>{parseDate(item.transaction.block_timestamp)}</td>
                  <td>
                    <Link
                      to={`/address/${item.from}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      <Tooltip title={item.from}>{`${item.from.slice(0, 8)}...${item.from.slice(-8)}`}</Tooltip>
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/address/${item.to}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      <Tooltip title={item.to}>{`${item.to.slice(0, 8)}...${item.to.slice(-8)}`}</Tooltip>
                    </Link>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={5} className={styles.noRecord}>
                {isLoading ? 'loading' : i18n.t(`nft.no_record`)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ul>
        {list.length ? (
          list.map(item => (
            <li key={item.id}>
              <div className={styles.item}>
                {item.item.icon_url ? (
                  <img src={item.item.icon_url} alt="cover" loading="lazy" className={styles.icon} />
                ) : (
                  <div className={styles.defaultIcon}>{item.id}</div>
                )}
                {`id: ${item.id}`}
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
                        {`${item.transaction.tx_hash.slice(0, 10)}...${item.transaction.tx_hash.slice(-10)}`}
                      </Tooltip>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>{i18n.t('nft.age')}</dt>
                  <dd>{parseDate(item.transaction.block_timestamp)}</dd>
                </div>
                <div>
                  <dt>{i18n.t('nft.from')}</dt>
                  <dd>
                    <Link
                      to={`/address/${item.from}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      <Tooltip title={item.from}>{`${item.from.slice(0, 8)}...${item.from.slice(-8)}`}</Tooltip>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>{i18n.t('nft.to')}</dt>
                  <dd>
                    <Link
                      to={`/address/${item.to}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      <Tooltip title={item.to}>{`${item.to.slice(0, 8)}...${item.to.slice(-8)}`}</Tooltip>
                    </Link>
                  </dd>
                </div>
              </dl>
            </li>
          ))
        ) : (
          <li>{isLoading ? 'loading' : i18n.t(`nft.no_record`)}</li>
        )}
      </ul>
    </div>
  )
}

NftCollectionTransfers.displayName = 'NftTransfers'

export default NftCollectionTransfers
