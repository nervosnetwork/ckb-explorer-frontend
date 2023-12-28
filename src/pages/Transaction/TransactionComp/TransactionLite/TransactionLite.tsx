/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import styles from './TransactionLite.module.scss'
import Capacity from '../../../../components/Capacity'
import { parseCKBAmount, parseUDTAmount } from '../../../../utils/number'
import { shannonToCkb } from '../../../../utils/util'
import { Addr } from '../../TransactionCell'
import { defaultTransactionLiteDetails } from '../../state'
import { TransactionBadge } from './TransactionBadge'
import { TransactionRecord, TransactionRecordTransfer, explorerService } from '../../../../services/ExplorerService'
import { useIsMobile } from '../../../../hooks'

const useGetTransferItemTag = () => {
  const { t } = useTranslation()
  return (transfer: TransactionRecordTransfer) => {
    const { cellType, udtInfo, mNftInfo } = transfer
    if (cellType === 'm_nft_token' || cellType === 'm_nft_class' || cellType === 'm_nft_issuer') {
      return `NFT-${mNftInfo?.className ?? 'Unknown'}`
    }
    if (cellType === 'udt') {
      return udtInfo?.symbol || `${t('udt.unknown_token')} #${udtInfo?.typeHash.substring(udtInfo.typeHash.length - 4)}`
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
}

export const TransactionCompLite: FC<{ isCellbase: boolean }> = ({ isCellbase }) => {
  const { hash: txHash } = useParams<{ hash: string }>()
  const isMobile = useIsMobile()

  const query = useQuery(['ckb_transaction_details', txHash], async () => {
    const ckbTransactionDetails = await explorerService.api.fetchTransactionLiteDetailsByHash(txHash)
    return ckbTransactionDetails.data
  })
  const transactionLiteDetails: TransactionRecord[] = query.data ?? defaultTransactionLiteDetails
  return (
    <div className={styles.transactionLites}>
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
    </div>
  )
}

export const DesktopTransferItems = (props: { details: TransactionRecord }) => {
  const { details } = props
  const { transfers } = details
  const getTransferItemTag = useGetTransferItemTag()
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

export const MobileTransferItems = (props: { details: TransactionRecord }) => {
  const { details } = props
  const { transfers } = details
  const getTransferItemTag = useGetTransferItemTag()
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

const TransferAmount: FC<{ transfer: TransactionRecordTransfer }> = ({ transfer }) => {
  const { t } = useTranslation()
  const isUdt = transfer.cellType === 'udt'
  const isNft = ['m_nft_token', 'spore_cell', 'nrc_721_token', 'cota', 'nft_transfer'].includes(transfer.cellType)

  const capacityChange = shannonToCkb(transfer.capacity)

  const ckbDiff = new BigNumber(capacityChange)
  let ckbDiffStatus = ''
  if (ckbDiff.isNegative()) {
    ckbDiffStatus = 'negative'
  } else if (!ckbDiff.isZero()) {
    ckbDiffStatus = 'positive'
  } else {
    // skip
  }

  if (isNft) {
    // FIXME: direction should be returned from API
    // Tracked by issue https://github.com/Magickbase/ckb-explorer-public-issues/issues/503
    return (
      <div>
        ID: {transfer.mNftInfo?.tokenId ?? 'Unknown'}
        <div className={styles.ckbDiff} data-diff-status={ckbDiffStatus}>
          <Capacity capacity={capacityChange} type="diff" display="short" />
        </div>
      </div>
    )
  }

  if (isUdt) {
    const transferAmount = new BigNumber(transfer.udtInfo?.amount ?? 0)
    const udtDecimals = transfer.udtInfo?.decimal
    if (udtDecimals) {
      const amountChange = parseUDTAmount(transferAmount.toString(), udtDecimals)
      return (
        <>
          <Capacity capacity={amountChange} type="diff" unit={null} display="short" />
          <div className={styles.ckbDiff} data-diff-status={ckbDiffStatus}>
            <Capacity capacity={capacityChange} type="diff" display="short" />
          </div>
        </>
      )
    }
    let diffStatus = ''
    if (transferAmount.isNegative()) {
      diffStatus = 'negative'
    } else if (transferAmount.isZero()) {
      // skip
    } else {
      diffStatus = 'positive'
    }
    return (
      <>
        <div className={styles.udtAmount} data-diff-status={diffStatus}>{`${t('udt.unknown_amount')}`}</div>

        <div className={styles.ckbDiff} data-diff-status={ckbDiffStatus}>
          <Capacity capacity={capacityChange} type="diff" display="short" />
        </div>
      </>
    )
  }

  return <Capacity capacity={capacityChange} type="diff" display="short" />
}
