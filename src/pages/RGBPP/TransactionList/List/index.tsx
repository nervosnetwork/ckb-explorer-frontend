import { TFunction, useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { TransactionLeapDirection } from '../../../../components/RGBPP/types'
import AddressText from '../../../../components/AddressText'
import { Link } from '../../../../components/Link'
import { localeNumberString } from '../../../../utils/number'
import SortButton from '../../../../components/SortButton'
import FilterButton from '../../../../components/FilterButton'
import { useStatistics } from '../../../../services/ExplorerService'
import { useIsMobile } from '../../../../hooks'
import { dayjs } from '../../../../utils/date'
import { ReactComponent as ShareIcon } from './share_icon.svg'
import config from '../../../../config'

const RGBTransactionList: React.FC<{ list: Transaction[] }> = ({ list }) => {
  const [t] = useTranslation()
  const statistics = useStatistics()
  const tipBlockNumber = parseInt(statistics?.tipBlockNumber ?? '0', 10)

  const filterFields = getFilterList(t)

  const headers = getTableHeaders(t)

  const isMobile = useIsMobile()

  return (
    <div className={`container ${styles.container}`}>
      {isMobile && (
        <div className={styles.filters}>
          <div className={styles.left}>
            {headers.map((header, key) => {
              return (
                (header.filter || header.order) &&
                key % 2 === 0 && (
                  <div>
                    {header.title}
                    {header.filter && (
                      <FilterButton filterName="type" key={header.key} filteredList={filterFields} isMobile />
                    )}
                    {header.order && <SortButton key={header.key} field={header.order} />}
                  </div>
                )
              )
            })}
          </div>
          <div className={styles.right}>
            {headers.map((header, key) => {
              return (
                (header.filter || header.order) &&
                key % 2 === 1 && (
                  <div>
                    {header.title}
                    {header.filter && (
                      <FilterButton filterName="type" key={header.key} filteredList={filterFields} isMobile />
                    )}
                    {header.order && <SortButton key={header.key} field={header.order} />}
                  </div>
                )
              )
            })}
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key}>
                {header.title}
                {header.order ? <SortButton key={header.key} field={header.order} /> : null}
                {header.filter ? <FilterButton filterName="type" key={header.key} filteredList={filterFields} /> : null}
              </th>
            ))}
          </tr>
          <tr key="split">
            <td className={styles.split} colSpan={headers.length}>
              {' '}
            </td>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map(item => {
              let leapDirection = '/'
              if (item.type === TransactionLeapDirection.IN) {
                leapDirection = 'Leap In'
              }

              if (item.type === TransactionLeapDirection.OUT) {
                leapDirection = 'Leap Out'
              }

              return (
                <tr key={item.ckbTxId}>
                  <td className={styles.hash} title={t('rgbpp.transaction.ckb_txid')}>
                    <div className={styles.transactionHash}>
                      <AddressText
                        disableTooltip
                        linkProps={{
                          to: `/transaction/${item.ckbTxId}`,
                        }}
                      >
                        {item.ckbTxId}
                      </AddressText>
                    </div>
                  </td>
                  <td className={styles.height} title={t('rgbpp.transaction.block_number')}>
                    <Link className={styles.blockLink} to={`/block/${item.blockNumber}`}>
                      {localeNumberString(item.blockNumber)}
                    </Link>
                  </td>
                  <td className={styles.confirmation} title={t('rgbpp.transaction.confirmation')}>
                    {localeNumberString(tipBlockNumber - item.blockNumber)}{' '}
                    {tipBlockNumber - item.blockNumber === 1
                      ? t('rgbpp.transaction.confirmation')
                      : t('rgbpp.transaction.confirmations')}
                  </td>
                  <td className={styles.time} title={t('rgbpp.transaction.time')}>
                    {dayjs(item.time).fromNow()}
                  </td>
                  <td className={styles.type} title={t('rgbpp.transaction.type')}>
                    {leapDirection}
                  </td>
                  <td className={styles.cellChange} title={t('rgbpp.transaction.rgbpp_cell_change')}>
                    {`${item.cellChange > 0 ? '+' : ''}${item.cellChange}`}{' '}
                    {Math.abs(item.cellChange) === 1 ? t('rgbpp.transaction.cell') : t('rgbpp.transaction.cells')}
                  </td>
                  <td className={styles.hash} title={t('rgbpp.transaction.btc_txid')}>
                    {item.btcTxId ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        <AddressText
                          style={{ marginLeft: 'auto' }}
                          disableTooltip
                          linkProps={{
                            to: `${config.BITCOIN_EXPLORER}/tx/${item.btcTxId}`,
                          }}
                        >
                          {item.btcTxId}
                        </AddressText>
                        <a
                          href={`${config.BITCOIN_EXPLORER}/tx/${item.btcTxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ShareIcon />
                        </a>
                      </div>
                    ) : (
                      '/'
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={headers.length} className={styles.noRecords}>
                {t('transaction.no_records')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RGBTransactionList

export type Transaction = {
  ckbTxId: string
  blockNumber: number
  time: number
  type: TransactionLeapDirection
  cellChange: number
  btcTxId: string
}

const getFilterList = (t: TFunction): Record<'key' | 'title' | 'value' | 'to', string>[] => {
  return [
    {
      key: 'leap_in',
      value: 'in',
      title: t('address.leap_in'),
      to: '',
    },
    {
      key: 'leap_out',
      value: 'out',
      title: t('address.leap_out'),
      to: '',
    },
    {
      key: 'equal',
      value: 'equal',
      title: '-',
      to: '',
    },
  ]
}

const getTableHeaders = (t: TFunction): TableHeader[] => {
  return [
    { title: t('rgbpp.transaction.ckb_txid'), key: 'ckb-txid' },
    { title: t('rgbpp.transaction.block_number'), key: 'block-number' },
    { title: t('rgbpp.transaction.confirmation'), key: 'confirmation' },
    { title: t('rgbpp.transaction.time'), key: 'time', order: 'time' },
    { title: t('rgbpp.transaction.type'), key: 'type', filter: 'leap_direction' },
    { title: t('rgbpp.transaction.rgbpp_cell_change'), key: 'cell-change' },
    { title: t('rgbpp.transaction.btc_txid'), key: 'btc-txid' },
  ]
}

interface TableHeader {
  title: string
  key: string
  order?: string
  filter?: string
}
