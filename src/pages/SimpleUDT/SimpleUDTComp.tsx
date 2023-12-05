import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import TransactionItem from '../../components/TransactionItem/index'
import {
  SimpleUDTTransactionsPagination,
  SimpleUDTTransactionsPanel,
  TypeScriptController,
  UDTNoResultPanel,
} from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import PaginationWithRear from '../../components/PaginationWithRear'
import { CsvExport } from '../../components/CsvExport'
import { Transaction } from '../../models/Transaction'
import { UDT } from '../../models/UDT'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../components/Card'
import { useIsMobile } from '../../hooks'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { isMainnet } from '../../utils/chain'
// TODO: replaced to svg format
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import Script from '../../components/Script'

const typeScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

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

export const SimpleUDTOverviewCard = ({ typeHash, udt }: { typeHash: string; udt: UDT }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const {
    displayName,
    uan,
    fullName,
    iconFile,
    issuerAddress,
    symbol,
    addressesCount,
    decimal,
    totalAmount,
    typeScript,
  } = udt
  const [showType, setShowType] = useState(false)

  const items: CardCellInfo<'left' | 'right'>[] = [
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
  ]

  // TODO: To be implemented.
  const modifyTokenInfo = false && <div>Modify Token Info</div>

  const cardTitle = (
    <div className={styles.cardTitle}>
      <div className={styles.top}>
        <img className={styles.icon} src={iconFile || SUDTTokenIcon} alt="hash icon" />
        {isMobile && modifyTokenInfo}
      </div>
      {(uan || symbol) ?? t('udt.sudt')}
    </div>
  )

  return (
    <Card className={styles.simpleUDTOverviewCard} style={{ marginBottom: 16 }}>
      {/* When encountering more complex requirements, consider extracting the components within HashCardHeader
      into smaller components. Then, implement a completely new variant or freely assemble them externally. */}
      {isMobile && cardTitle}
      <HashCardHeader
        className={styles.cardHeader}
        title={!isMobile && cardTitle}
        hash={typeHash}
        rightContent={!isMobile && modifyTokenInfo}
      />

      <CardCellsLayout type="left-right" cells={items} borderTop />

      <TypeScriptController onClick={() => setShowType(!showType)}>
        <div>{t('udt.type_script')}</div>
        <img alt="type script" src={typeScriptIcon(showType)} />
      </TypeScriptController>
      {showType && typeScript && <Script script={typeScript} />}
    </Card>
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
  transactions: Transaction[]
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
          (transaction: Transaction, index: number) =>
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
