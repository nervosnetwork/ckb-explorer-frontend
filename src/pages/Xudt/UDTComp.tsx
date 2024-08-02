import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { utils } from '@ckb-lumos/base'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Link } from '../../components/Link'
import { CsvExport } from '../../components/CsvExport'
import TransactionItem from '../../components/TransactionItem/index'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr, getBtcUtxo } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import PaginationWithRear from '../../components/PaginationWithRear'
import { Transaction } from '../../models/Transaction'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../components/Card'
import { SubmitTokenInfo, TokenInfo } from '../../components/SubmitTokenInfo'
import { useIsMobile } from '../../hooks'
import Script from '../../components/Script'
import { RawBtcRPC } from '../../services/ExplorerService'
import { XUDT, XUDTHolderAllocation } from '../../models/Xudt'
import { getBtcTxList } from '../../services/ExplorerService/fetcher'
import XUDTTag from '../../components/XUDTTag'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import HolderAllocation from './HolderAllocation'
import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import XUDTTokenIcon from '../../assets/sudt_token.png'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { scripts } from '../ScriptList'

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

const xudtCodeUrl = scripts.get('xUDT')?.code

export const UDTOverviewCard = ({
  typeHash,
  xudt,
  holderAllocation,
  refetchUDT,
}: {
  typeHash: string
  holderAllocation?: XUDTHolderAllocation
  xudt?: XUDT
  refetchUDT: () => void
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [isScriptDisplayed, setIsScriptDisplayed] = useState(false)
  const [showHolderAmountModal, setShowHolderAmountModal] = useState(false)
  const [isModifyTokenInfoModalOpen, setIsModifyTokenInfoModalOpen] = useState<boolean>(false)

  const issuer = xudt?.issuerAddress
  const script = xudt?.typeScript ?? null

  const hash = script
    ? utils.computeScriptHash({
        codeHash: script.codeHash,
        hashType: script.hashType as any,
        args: script.args,
      })
    : null

  const toggleScriptDisplay = () => {
    if (!script) {
      return
    }
    setIsScriptDisplayed(is => !is)
  }

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

  const ckbHolderAmount = holderAllocation?.lockHashes.reduce((acc, cur) => acc + +cur.holderCount, 0) ?? 0
  const holderCount = holderAllocation ? ckbHolderAmount + +(holderAllocation?.btcHolderCount ?? 0) : 0

  const items: CardCellInfo<'left' | 'right'>[] = [
    {
      title: t('xudt.name'),
      content: xudt?.fullName ?? '-',
    },
    {
      title: issuerOnBtc ? t('xudt.issuer') : t('xudt.owner'),
      contentWrapperClass: styles.addressWidthModify,
      content: issuer ? <IssuerContent address={issuerOnBtc ?? issuer} /> : '-',
    },
    {
      title: t('xudt.holders'),
      content: holderAllocation ? (
        <SimpleButton
          className={styles.holderAddressesButton}
          onClick={() => {
            setShowHolderAmountModal(true)
          }}
        >
          {localeNumberString(holderCount)}
        </SimpleButton>
      ) : (
        '-'
      ),
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

  const tokenInfo: TokenInfo | null = xudt
    ? {
        tokenType: xudt.udtType,
        typeHash,
        symbol: xudt.symbol ?? '',
        name: xudt.fullName ?? '',
        decimal: xudt.decimal ?? '',
        description: xudt.description,
        website: xudt.operatorWebsite ?? '',
        creatorEmail: xudt.email ?? '',
        logo: xudt.iconFile,
      }
    : null

  const modifyTokenInfo = xudt?.email ? (
    <button type="button" className={styles.modify} onClick={() => setIsModifyTokenInfoModalOpen(true)}>
      {t('udt.modify_token_info')}
      <EditIcon />
    </button>
  ) : null

  const cardTitle = (
    <div className={styles.cardTitle}>
      <img className={styles.icon} src={xudt?.iconFile ?? XUDTTokenIcon} alt="hash icon" />
      {xudt?.symbol ?? t('xudt.xudt')}
      {isMobile ? modifyTokenInfo : null}
    </div>
  )

  const tags = xudt?.xudtTags ?? []

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
          rightContent={!isMobile && modifyTokenInfo}
        />

        <div className={styles.tags}>
          {tags.map(tag => (
            <XUDTTag tagName={tag} />
          ))}
          {xudtCodeUrl ? (
            <Link className={styles.openSource} to={xudtCodeUrl}>
              {t('scripts.open_source_script')}
              <OpenSourceIcon />
            </Link>
          ) : null}
        </div>

        <CardCellsLayout type="left-right" cells={items} borderTop />
        {holderAllocation && (
          <SimpleModal isShow={showHolderAmountModal} setIsShow={setShowHolderAmountModal}>
            <HolderAllocation
              ckbHolderAmount={localeNumberString(ckbHolderAmount)}
              btcHolderAmount={holderAllocation.btcHolderCount}
              lockHoderAmount={holderAllocation.lockHashes}
              onClose={() => setShowHolderAmountModal(false)}
            />
          </SimpleModal>
        )}

        <SimpleButton className={styles.typeScriptController} onClick={toggleScriptDisplay}>
          {isScriptDisplayed ? (
            <div className={styles.scriptToggle}>
              <EyeOpenIcon />
              <div>{t('xudt.type_script')}</div>
            </div>
          ) : (
            <div className={styles.scriptToggle}>
              <EyeClosedIcon />
              <div>{t('xudt.type_script_hash')}</div>
            </div>
          )}
        </SimpleButton>

        {isScriptDisplayed ? (
          script && <Script script={script} />
        ) : (
          <div className={`monospace ${styles.scriptHash}`}>{hash}</div>
        )}
      </Card>
      {tokenInfo && isModifyTokenInfoModalOpen ? (
        <SubmitTokenInfo
          onClose={() => setIsModifyTokenInfoModalOpen(false)}
          initialInfo={tokenInfo}
          onSuccess={refetchUDT}
          tagFilters={['xudt']}
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
  xudt,
  filterNoResult,
}: {
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  onPageChange: (page: number) => void
  xudt?: XUDT
  filterNoResult?: boolean
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <div className={styles.udtNoResultPanel}>
        <span>{t('search.udt_filter_no_result')}</span>
      </div>
    )
  }
  return (
    <>
      <div className={styles.udtTransactionsPanel}>
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
      </div>
      <div className={styles.udtTransactionsPagination}>
        <PaginationWithRear
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
          rear={xudt ? <CsvExport link={`/export-xudt-holders?id=${xudt.typeHash}`} /> : null}
        />
      </div>
    </>
  )
}

export default UDTComp
