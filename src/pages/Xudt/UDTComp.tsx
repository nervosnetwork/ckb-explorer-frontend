import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Link } from '../../components/Link'
import TransactionItem from '../../components/TransactionItem/index'
import { UDTTransactionsPagination, UDTTransactionsPanel, TypeScriptController, UDTNoResultPanel } from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr, getBtcUtxo } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import PaginationWithRear from '../../components/PaginationWithRear'
import { Transaction } from '../../models/Transaction'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../components/Card'
import { useIsMobile } from '../../hooks'
import { isMainnet } from '../../utils/chain'
// TODO: replaced to svg format
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import Script from '../../components/Script'
import { RawBtcRPC } from '../../services/ExplorerService'
import { XUDT } from '../../models/Xudt'
import { getBtcTxList } from '../../services/ExplorerService/fetcher'

const typeScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const IssuerContent: FC<{ address: string }> = ({ address }) => {
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

export const UDTOverviewCard = ({ typeHash, xudt }: { typeHash: string; xudt: XUDT | undefined }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [showType, setShowType] = useState(false)

  const issuer = xudt?.issuerAddress

  const { data: issuerOnBtc } = useQuery(
    ['btc-addr', issuer],
    async () => {
      if (!issuer) return null
      const btcUtxo = getBtcUtxo(addressToScript(issuer))
      if (!btcUtxo?.txid || btcUtxo?.index === undefined) return null

      const { txid, index } = btcUtxo
      const btcTx = await getBtcTxList([txid]).then(res => res[txid])
      return btcTx?.vout[parseInt(index, 16)]?.scriptPubKey?.address ?? null
    },
    {
      initialData: null,
      enabled: !!issuer,
    },
  )

  const items: CardCellInfo<'left' | 'right'>[] = [
    {
      title: t('xudt.name'),
      content: xudt?.fullName ?? '-',
    },
    {
      title: t('xudt.owner'),
      contentWrapperClass: styles.addressWidthModify,
      content: issuer ? <IssuerContent address={issuerOnBtc ?? issuer} /> : '-',
    },
    {
      title: t('xudt.holder_addresses'),
      content: xudt?.addressesCount ?? '-',
    },
    {
      title: t('xudt.symbol'),
      content: xudt?.symbol ?? '-',
    },
    {
      title: t('xudt.decimal'),
      content: xudt?.decimal ?? '-',
    },
    {
      title: t('xudt.total_amount'),
      content: xudt?.totalAmount && xudt?.decimal ? parseUDTAmount(xudt.totalAmount, xudt.decimal) : '-',
    },
  ]

  const cardTitle = <div className={styles.cardTitle}>{xudt?.symbol ?? t('xudt.xudt')}</div>

  return (
    <>
      <Card className={styles.udtOverviewCard} style={{ marginBottom: 16 }}>
        {/* When encountering more complex requirements, consider extracting the components within HashCardHeader
      into smaller components. Then, implement a completely new variant or freely assemble them externally. */}
        {isMobile && cardTitle}
        <HashCardHeader className={styles.cardHeader} title={!isMobile && cardTitle} hash={typeHash} />

        <CardCellsLayout type="left-right" cells={items} borderTop />

        <TypeScriptController onClick={() => setShowType(!showType)}>
          <div>{t('xudt.type_script')}</div>
          <img alt="type script" src={typeScriptIcon(showType)} />
        </TypeScriptController>
        {showType && xudt?.typeScript && <Script script={xudt.typeScript} />}
      </Card>
    </>
  )
}

export const UDTComp = ({
  currentPage,
  pageSize,
  transactions,
  total,
  onPageChange,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
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
      <UDTTransactionsPanel>
        {transactions.map(
          (transaction, index) =>
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
      </UDTTransactionsPanel>
      <UDTTransactionsPagination>
        <PaginationWithRear currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} rear={null} />
      </UDTTransactionsPagination>
    </>
  )
}

export default UDTComp
