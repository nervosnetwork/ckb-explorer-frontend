/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Card } from '../../../components/Card'
import styles from './TransactionDetailsHeader.module.scss'
import { TransactionRGBPPDigestContent } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/TransactionRGBPPDigestContent'
import BtcTransaction from '../../../components/Btc/Transaction'
import { explorerService, RawBtcRPC } from '../../../services/ExplorerService'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { TransactionLeapDirection } from '../../../components/RGBPP/types'

export const RGBDigestComp = ({ hash, txid }: { hash: string; txid?: string }) => {
  const { t } = useTranslation()
  const { data: btcTx, isLoading: isBtcTxLoading } = useQuery(['btc_tx', txid], async () =>
    txid
      ? explorerService.api.getBtcTxList([txid]).then((res: Record<string, RawBtcRPC.BtcTx>) => res[txid])
      : undefined,
  )

  const { data: rgbDigest, isFetched: isDigestFetched } = useQuery(['rgb-digest', hash], () =>
    explorerService.api.fetchRGBDigest(hash),
  )

  const { data: displayInputs = { data: [] } } = useQuery(['transaction_inputs', hash, 1, 10], async () => {
    try {
      const res = await explorerService.api.fetchCellsByTxHash(hash, 'inputs', { no: 1, size: 10 })
      return res
    } catch (e) {
      return { data: [] }
    }
  })

  const { data: displayOutputs = { data: [] } } = useQuery(['transaction_outputs', hash, 1, 10], async () => {
    try {
      const res = await explorerService.api.fetchCellsByTxHash(hash, 'outputs', {
        no: 1,
        size: 10,
      })
      return res
    } catch (e) {
      return { data: [] }
    }
  })
  const boundCellIndex = useMemo(() => {
    const map: Record<string, number> = {}
    displayInputs.data.forEach((input, idx) => {
      if (!input.rgbInfo) return
      map[`${input.rgbInfo.txid}-${input.rgbInfo.index}`] = idx
    })
    displayOutputs.data.forEach((output, idx) => {
      if (!output.rgbInfo) return
      map[`${output.rgbInfo.txid}-${output.rgbInfo.index}`] = idx
    })
    return map
  }, [displayInputs, displayOutputs])

  const direction = useMemo(() => {
    switch (rgbDigest?.data.leapDirection) {
      case 'in':
        return TransactionLeapDirection.IN
      case 'leapoutBTC':
        return TransactionLeapDirection.OUT
      case 'withinBTC':
        return TransactionLeapDirection.WITH_IN_BTC
      default:
        return TransactionLeapDirection.NONE
    }
  }, [rgbDigest])

  return (
    <>
      <Card className={styles.transactionHeader}>
        <div className={styles.headerContent}>
          <p>{t('transaction.rgb_digest')} </p>
          {direction !== TransactionLeapDirection.NONE && (
            <span className={styles.leap}>{t(`address.leap_${direction}`)}</span>
          )}
        </div>
      </Card>
      <Card className={styles.digestContent}>
        {rgbDigest && (
          <TransactionRGBPPDigestContent hash={hash} digest={rgbDigest?.data} isFetched={isDigestFetched} />
        )}
        <div className={styles.btcTxContent}>
          {isBtcTxLoading ? <SmallLoading /> : null}
          {btcTx?.vout.some(v => v.scriptPubKey.asm.includes('OP_RETURN')) ? (
            <BtcTransaction tx={btcTx} showId={false} boundCellIndex={boundCellIndex} />
          ) : null}
        </div>
      </Card>
    </>
  )
}
