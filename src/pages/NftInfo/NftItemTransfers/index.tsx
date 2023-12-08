import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { getPrimaryColor } from '../../../constants/common'
import { dayjs, useParseDate } from '../../../utils/date'
import styles from './styles.module.scss'
import { useCurrentLanguage } from '../../../utils/i18n'
import type { TransferRes } from '../../../services/ExplorerService/fetcher'

const primaryColor = getPrimaryColor()

const NftItemTransfers: React.FC<{ list: TransferRes[]; isLoading: boolean }> = ({ list, isLoading }) => {
  const [isShowInAge, setIsShowInAge] = useState(false)
  const { t } = useTranslation()
  const parseDate = useParseDate()
  const currentLanguage = useCurrentLanguage()

  dayjs.locale(currentLanguage === 'zh' ? 'zh-cn' : 'en')

  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
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
                  <td>{t(`nft.action_type.${item.action}`)}</td>
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
                {isLoading ? t('nft.loading') : t(`nft.no_record`)}
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
                  <dd>{parseDate(item.transaction.block_timestamp)}</dd>
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
          ))
        ) : (
          <li>{isLoading ? t('nft.loading') : t(`nft.no_record`)}</li>
        )}
      </ul>
    </div>
  )
}

NftItemTransfers.displayName = 'NftTransfers'

export default NftItemTransfers
