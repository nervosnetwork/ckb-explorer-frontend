import { ReactNode } from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel, UDTNoResultPanel } from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import PaginationWithRear from '../../components/PaginationWithRear'
import { CsvExport } from '../../components/CsvExport'

const useAddressContent = (address: string) => {
  const { t } = useTranslation()
  if (!address) {
    return t('address.unable_decode_address')
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
        <Tooltip placement="top" title={t(`udt.view-deprecated-address`)}>
          <Link to={`/address/${address}`} className={styles.openInNew} target="_blank">
            <OpenInNew />
          </Link>
        </Tooltip>
      )}
    </>
  )
}

const useSimpleUDTInfo = (udt: State.UDT) => {
  const { t } = useTranslation()
  const { displayName, uan, fullName, issuerAddress, symbol, addressesCount, decimal, totalAmount } = udt
  return [
    {
      title: t('udt.name'),
      content: displayName || fullName,
    },
    {
      title: t('udt.issuer'),
      contentWrapperClass: styles.addressWidthModify,
      content: useAddressContent(issuerAddress),
    },
    {
      title: t('udt.holder_addresses'),
      content: addressesCount,
    },
    {
      title: t(uan ? 'udt.uan' : 'udt.symbol'),
      content: uan || symbol,
    },
    {
      title: t('udt.decimal'),
      content: decimal,
    },
    {
      title: t('udt.total_amount'),
      content: parseUDTAmount(totalAmount, decimal),
    },
  ] as OverviewItemData[]
}

export const SimpleUDTOverview = ({ children, udt }: { children: ReactNode; udt: State.UDT }) => {
  return (
    <OverviewCard items={useSimpleUDTInfo(udt)} hideShadow>
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
  id,
}: {
  currentPage: number
  pageSize: number
  transactions: State.Transaction[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
  id: string
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <UDTNoResultPanel>
        <span>{t('search.udt_filter_no_result')}</span>
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
      <SimpleUDTTransactionsPagination>
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
          rear={<CsvExport type="udts" id={id} />}
        />
      </SimpleUDTTransactionsPagination>
    </>
  )
}

export default SimpleUDTComp
