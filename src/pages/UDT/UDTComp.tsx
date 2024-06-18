import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Link } from '../../components/Link'
import TransactionItem from '../../components/TransactionItem/index'
import { UDTTransactionsPagination, UDTTransactionsPanel, TypeScriptController, UDTNoResultPanel } from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import PaginationWithRear from '../../components/PaginationWithRear'
import { CsvExport } from '../../components/CsvExport'
import { Transaction } from '../../models/Transaction'
import { OmigaInscriptionCollection, UDT, isOmigaInscriptionCollection, MintStatus } from '../../models/UDT'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../components/Card'
import { SubmitTokenInfo, TokenInfo } from '../../components/SubmitTokenInfo'
import { useIsMobile } from '../../hooks'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { isMainnet } from '../../utils/chain'
// TODO: replaced to svg format
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import Script from '../../components/Script'
import Capacity from '../../components/Capacity'
import { ReactComponent as EditIcon } from './edit.svg'
import { ReactComponent as ViewOriginalIcon } from './view_original.svg'
import Loading from '../../components/Loading'
import { RawBtcRPC } from '../../services/ExplorerService'

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

export const UDTOverviewCard = ({
  typeHash,
  udt,
  refetchUDT,
}: {
  typeHash: string
  udt: UDT | OmigaInscriptionCollection
  refetchUDT: () => void
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { fullName, iconFile, issuerAddress, symbol, addressesCount, decimal, totalAmount, typeScript } = udt
  const [showType, setShowType] = useState(false)
  const [isModifyTokenInfoModalOpen, setIsModifyTokenInfoModalOpen] = useState<boolean>(false)

  const items: CardCellInfo<'left' | 'right'>[] = !isOmigaInscriptionCollection(udt)
    ? [
        {
          title: t('udt.name'),
          content: fullName,
        },
        {
          title: t('udt.owner'),
          contentWrapperClass: styles.addressWidthModify,
          content: <IssuerContent address={issuerAddress} />,
        },
        {
          title: t('udt.holder_addresses'),
          content: addressesCount,
        },
        {
          title: t('udt.symbol'),
          content: symbol,
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
    : [
        {
          title: t('udt.name'),
          content: fullName || <span className={styles.noneName}>(None)</span>,
        },
        {
          title: t('udt.status'),
          content: t(`udt.mint_status_${udt.mintStatus}`),
        },
        {
          title: t('udt.progress'),
          content: `${parseUDTAmount(udt.totalAmount, decimal)}/${parseUDTAmount(udt.expectedSupply, decimal)}`,
        },
        {
          title: t('udt.holder_addresses'),
          content: addressesCount,
        },
        {
          title: t('udt.expected_supply'),
          content: (
            <Capacity
              capacity={BigNumber(udt.expectedSupply)
                .div(new BigNumber(10).pow(parseInt(decimal, 10)))
                .toString()}
              unit={null}
            />
          ),
        },
        {
          title: t('udt.decimal'),
          content: decimal,
        },
        {
          title: t('udt.mint_limit'),
          content: parseUDTAmount(udt.mintLimit, decimal),
        },
      ]

  const tokenInfo: TokenInfo = {
    tokenType: udt.udtType,
    args: udt.typeScript?.args ?? null,
    typeHash,
    symbol: udt.symbol,
    name: udt.fullName,
    decimal: udt.decimal,
    description: udt.description,
    website: udt.operatorWebsite ?? '',
    creatorEmail: udt.email ?? '',
    logo: iconFile,
  }

  const modifyTokenInfo =
    udt.udtType === 'sudt' ? (
      <button type="button" className={styles.modify} onClick={() => setIsModifyTokenInfoModalOpen(true)}>
        {t('udt.modify_token_info')}
        <EditIcon />
      </button>
    ) : null

  const cardTitle = (
    <div className={styles.cardTitle}>
      <div className={styles.top}>
        <img className={styles.icon} src={iconFile || SUDTTokenIcon} alt="hash icon" />
        {isMobile && modifyTokenInfo}
      </div>
      {symbol ?? t('udt.sudt')}
    </div>
  )

  if (udt.udtType !== 'omiga_inscription' && !udt.published) {
    return (
      <div className={styles.loading}>
        <Loading show />
      </div>
    )
  }

  return (
    <>
      <Card className={styles.udtOverviewCard} style={{ marginBottom: 16 }}>
        {/* When encountering more complex requirements, consider extracting the components within HashCardHeader
      into smaller components. Then, implement a completely new variant or freely assemble them externally. */}
        {isMobile && cardTitle}
        <HashCardHeader
          className={styles.cardHeader}
          title={!isMobile && cardTitle}
          hash={typeHash}
          customActions={[
            isOmigaInscriptionCollection(udt) && udt.mintStatus === MintStatus.RebaseStart ? (
              <Tooltip placement="top" title={t('udt.view_original')}>
                <Link
                  to={`/inscription/${udt.infoTypeHash}?view=original`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewOriginal}
                >
                  <ViewOriginalIcon />
                </Link>
              </Tooltip>
            ) : null,
          ]}
          rightContent={!isMobile && modifyTokenInfo}
        />

        <CardCellsLayout type="left-right" cells={items} borderTop />

        <TypeScriptController onClick={() => setShowType(!showType)}>
          <div>{t('udt.type_script')}</div>
          <img alt="type script" src={typeScriptIcon(showType)} />
        </TypeScriptController>
        {showType && typeScript && <Script script={typeScript} />}
      </Card>
      {tokenInfo && isModifyTokenInfoModalOpen ? (
        <SubmitTokenInfo
          onClose={() => setIsModifyTokenInfoModalOpen(false)}
          initialInfo={tokenInfo}
          onSuccess={refetchUDT}
        />
      ) : null}
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
  id,
  isInscription,
  isViewOriginal,
}: {
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  onPageChange: (page: number) => void
  filterNoResult?: boolean
  id: string
  isInscription?: boolean
  isViewOriginal?: boolean
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
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
          rear={
            <CsvExport
              link={`/export-transactions?type=${isInscription ? 'omiga_inscriptions' : 'udts'}&id=${id}${
                isViewOriginal ? '&view=original' : ''
              }`}
            />
          }
        />
      </UDTTransactionsPagination>
    </>
  )
}

export default UDTComp
