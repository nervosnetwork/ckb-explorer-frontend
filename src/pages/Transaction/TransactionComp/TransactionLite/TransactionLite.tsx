/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styles from './TransactionLite.module.scss'
import DecimalCapacity from '../../../../components/DecimalCapacity'
import { parseCKBAmount, localeNumberString } from '../../../../utils/number'
import { shannonToCkb } from '../../../../utils/util'
import { Addr } from '../../TransactionCell'
import { defaultTransactionLiteDetails } from '../../state'
import { TransactionBadge } from './TransactionBadge'
import { explorerService } from '../../../../services/ExplorerService'
import { useIsMobile } from '../../../../utils/hook'

const getTransferItemTag = (transfer: State.LiteTransfer) => {
  const { cellType, udtInfo, mNftInfo } = transfer
  if (cellType === 'm_nft_token' || cellType === 'm_nft_class' || cellType === 'm_nft_issuer') {
    return `NFT-${mNftInfo?.className ?? 'Unknown'}`
  }
  if (cellType === 'udt') {
    return udtInfo?.symbol || `Uknown Asset #${udtInfo?.typeHash.substring(udtInfo.typeHash.length - 4)}`
  }
  if (cellType === 'spore_cell' || cellType === 'spore_cluster') {
    return 'Spore'
  }
  if (cellType === 'cota_regular' || cellType === 'cota_registry') {
    return 'Cota'
  }
  if (cellType === 'nervos_dao_deposit' || cellType === 'nervos_dao_withdrawing') {
    return 'Nervos DAO'
  }
  if (cellType === 'nrc_721_token' || cellType === 'nrc_721_factory') {
    return 'NRC-721'
  }
  return 'CKB'
}

export const TransactionCompLite: FC<{ isCellbase: boolean }> = ({ isCellbase }) => {
  const { hash: txHash } = useParams<{ hash: string }>()
  const isMobile = useIsMobile()

  const query = useQuery(['ckb_transaction_details', txHash], async () => {
    const ckbTransactionDetails = await explorerService.api.fetchTransactionLiteDetailsByHash(txHash)
    return ckbTransactionDetails.data
  })
  const transactionLiteDetails: State.TransactionLiteDetails[] = query.data ?? defaultTransactionLiteDetails
  return (
    <>
      {transactionLiteDetails &&
        transactionLiteDetails.map(item => (
          <div className="transactionLite" key={item.address}>
            <div className={styles.transactionLiteBox}>
              <div className={styles.transactionLiteBoxHeader}>
                <div className={styles.transactionLiteBoxHeaderAddr}>
                  <Addr address={item.address} isCellBase={isCellbase} />
                </div>
              </div>
              {isMobile ? <MobileTransferItems details={item} /> : <DesktopTransferItems details={item} />}
            </div>
          </div>
        ))}
    </>
  )
}

export const DesktopTransferItems = (props: { details: State.TransactionLiteDetails }) => {
  const { details } = props
  const { transfers } = details
  return (
    <div className={styles.transactionLiteBoxContent}>
      {transfers.map((transfer, index) => {
        return (
          <div key={`transfer-${index}`}>
            <div>{getTransferItemTag(transfer)}</div>
            <div className={styles.addressDetailLite}>
              <TransactionBadge cellType={transfer.cellType} capacity={parseCKBAmount(transfer.capacity)} />
              <TransferAmount transfer={transfer} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const MobileTransferItems = (props: { details: State.TransactionLiteDetails }) => {
  const { details } = props
  const { transfers } = details
  return (
    <div className={styles.transactionLiteBoxContent}>
      {transfers.map((transfer, index) => {
        return (
          <div key={`transfer-tag-${index}`}>
            <div>{getTransferItemTag(transfer)}</div>
          </div>
        )
      })}
      {transfers.map((transfer, index) => {
        return (
          <div key={`transfer-detail-${index}`}>
            <div className={styles.addressDetailLite}>
              <TransferAmount transfer={transfer} />
              <TransactionBadge cellType={transfer.cellType} capacity={parseCKBAmount(transfer.capacity)} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const TransferAmount: FC<{ transfer: State.LiteTransfer }> = ({ transfer }) => {
  const isUdt = transfer.cellType === 'udt'
  const isNft = transfer.cellType === 'm_nft_token'

  const transferCapacity = new BigNumber(transfer.capacity)
  const transferAmount = new BigNumber(transfer.udtInfo?.amount ?? 0)
  const isIncome = isUdt ? transferAmount.isPositive() : transferCapacity.isPositive()
  const decimalPanelType = isIncome ? 'income' : 'payment'

  const amountChange = localeNumberString(shannonToCkb(transferAmount))
  const capacityChange = localeNumberString(shannonToCkb(transferCapacity))
  const isIncomeColor = isIncome ? styles.add : styles.subtraction

  const getUdtComponent = () => {
    if (isUdt) {
      return (
        <>
          <DecimalCapacity balanceChangeType={decimalPanelType} value={amountChange} hideUnit hideZero />
          <div className={isIncomeColor}>{`(${capacityChange} CKB)`}</div>
        </>
      )
    }
    if (isNft) {
      return (
        <div className={isIncomeColor}>
          {isIncome ? '' : '-'}
          ID: {transfer.mNftInfo?.tokenId ?? 'Unknown'}
          {`(${capacityChange} CKB)`}
        </div>
      )
    }
    return <DecimalCapacity balanceChangeType={decimalPanelType} value={capacityChange} />
  }
  return (
    <div className={styles.capacityChange}>
      <span className={isIncomeColor}>{isIncome ? '+' : ''}</span>
      {getUdtComponent()}
    </div>
  )
}
