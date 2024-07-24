import { TFunction, useTranslation } from 'react-i18next'
import { ReactNode } from 'react'
import styles from './styles.module.scss'
import SortButton from '../../../../components/SortButton'
import FilterButton from '../../../../components/FilterButton'
import { useIsMobile } from '../../../../hooks'
import Item, { type Transaction } from './item'
import { HelpTip } from '../../../../components/HelpTip'

const RGBTransactionList: React.FC<{ list: Transaction[] }> = ({ list }) => {
  const [t] = useTranslation()

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
            list.map(item => <Item key={item.ckbTxId} item={item} />)
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
export { Transaction }

const getFilterList = (
  t: TFunction,
): (Record<'key' | 'value' | 'to', string> & Record<'title', string | ReactNode>)[] => {
  return [
    {
      key: 'leap_in',
      value: 'in',
      title: t('address.leap_in'),
      to: '',
    },
    {
      key: 'leap_out',
      value: 'leapoutBTC',
      title: t('address.leap_out'),
      to: '',
    },
    {
      key: 'leap_with_in_btc',
      value: 'withinBTC',
      title: t('address.leap_with_in_btc'),
      to: '',
    },
    {
      key: 'other',
      value: 'other',
      title: (
        <div>
          <span>{t('rgbpp.transaction.direction.other')}</span>
          <HelpTip title={t('rgbpp.transaction.direction.description.other')} />
        </div>
      ),
      to: '',
    },
  ]
}

const getTableHeaders = (t: TFunction): TableHeader[] => {
  return [
    { title: t('rgbpp.transaction.ckb_tx'), key: 'ckb-txid' },
    { title: t('rgbpp.transaction.block_number'), key: 'block-number' },
    { title: t('rgbpp.transaction.confirmation'), key: 'confirmation' },
    { title: t('rgbpp.transaction.time'), key: 'time', order: 'time' },
    { title: t('rgbpp.transaction.type'), key: 'type', filter: 'leap_direction' },
    { title: t('rgbpp.transaction.rgbpp_cell_change'), key: 'cell-change' },
    { title: t('rgbpp.transaction.btc_tx'), key: 'btc-txid' },
  ]
}

interface TableHeader {
  title: string
  key: string
  order?: string
  filter?: string
}
