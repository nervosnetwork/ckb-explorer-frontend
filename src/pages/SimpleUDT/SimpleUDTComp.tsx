import { ReactNode } from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import i18n from '../../utils/i18n'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel, UDTNoResultPanel } from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'

const addressContent = (address: string) => {
  if (!address) {
    return i18n.t('address.unable_decode_address')
  }
  const newAddress = deprecatedAddrToNewAddr(address)

  return (
    <>
      <AddressText
        linkProps={{
          to: `/address/${newAddress}`,
        }}
      >
        {newAddress}
      </AddressText>

      {newAddress !== address && (
        <Tooltip placement="top" title={i18n.t(`udt.view-deprecated-address`)}>
          <Link to={`/address/${address}`} className={styles.openInNew} target="_blank">
            <OpenInNew />
          </Link>
        </Tooltip>
      )}
    </>
  )
}

const simpleUDTInfo = (udt: State.UDT) => {
  const { displayName, uan, fullName, issuerAddress, symbol, addressesCount, decimal, totalAmount } = udt
  return [
    {
      title: i18n.t('udt.name'),
      content: displayName || fullName,
    },
    {
      title: i18n.t('udt.issuer'),
      contentWrapperClass: styles.addressWidthModify,
      content: addressContent(issuerAddress),
    },
    {
      title: i18n.t('udt.holder_addresses'),
      content: addressesCount,
    },
    {
      title: i18n.t(uan ? 'udt.uan' : 'udt.symbol'),
      content: uan || symbol,
    },
    {
      title: i18n.t('udt.decimal'),
      content: decimal,
    },
    {
      title: i18n.t('udt.total_amount'),
      content: parseUDTAmount(totalAmount, decimal),
    },
  ] as OverviewItemData[]
}

export const SimpleUDTOverview = ({ children, udt }: { children: ReactNode; udt: State.UDT }) => {
  return (
    <OverviewCard items={simpleUDTInfo(udt)} hideShadow>
      {children}
    </OverviewCard>
  )
}

export const SimpleUDTComp = ({
  currentPage,
  pageSize,
  transactions,
  total,
  onPageChange,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: State.Transaction[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
}) => {
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <UDTNoResultPanel>
        <span>{i18n.t('search.udt_filter_no_result')}</span>
      </UDTNoResultPanel>
    )
  }
  return (
    <>
      <SimpleUDTTransactionsPanel>
        {transactions.map(
          (transaction: State.Transaction, index: number) =>
            transaction && (
              <TransactionItem
                transaction={transaction}
                key={transaction.transactionHash}
                circleCorner={{
                  bottom: index === transactions.length - 1 && totalPages === 1,
                }}
              />
            ),
        )}
      </SimpleUDTTransactionsPanel>
      {totalPages > 1 && (
        <SimpleUDTTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </SimpleUDTTransactionsPagination>
      )}
    </>
  )
}

export default SimpleUDTComp
