/* eslint-disable react/no-array-index-key */
import { useState, FC } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { Link } from '../../../components/Link'
import Capacity from '../../../components/Capacity'
import SimpleButton from '../../../components/SimpleButton'
import ComparedToMaxTooltip from '../../../components/Tooltip/ComparedToMaxTooltip'
import { LayoutLiteProfessional } from '../../../constants/common'
import { parseSimpleDate } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkb, useFormatConfirmation } from '../../../utils/util'
import { TransactionBlockHeightPanel, TransactionOverviewPanel } from './styled'
import { explorerService, useLatestBlockNumber } from '../../../services/ExplorerService'
import { Transaction } from '../../../models/Transaction'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../../components/Card'
import RawTransactionView from '../../../components/RawTransactionView'
import { ReactComponent as DownloadIcon } from './download.svg'
import { useSetToast } from '../../../components/Toast'
import { useIsMobile } from '../../../hooks'
import styles from './TransactionOverview.module.scss'
import TransactionParameters from '../../../components/TransactionParameters'

const showTxStatus = (txStatus: string) => txStatus?.replace(/^\S/, s => s.toUpperCase()) ?? '-'
const TransactionBlockHeight = ({ blockNumber, txStatus }: { blockNumber: number; txStatus: string }) => (
  <TransactionBlockHeightPanel>
    {txStatus === 'committed' ? (
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    ) : (
      <span>{showTxStatus(txStatus)}</span>
    )}
  </TransactionBlockHeightPanel>
)

export const TransactionOverviewCard: FC<{
  txHash: string
  transaction: Transaction
  layout: LayoutLiteProfessional
  isRGB?: boolean
}> = ({ txHash, transaction, layout, isRGB }) => {
  const [detailTab, setDetailTab] = useState<'params' | 'raw' | null>(null)
  const tipBlockNumber = useLatestBlockNumber()
  const {
    blockNumber,
    blockTimestamp,
    transactionFee,
    txStatus,
    detailedMessage,
    bytes,
    largestTxInEpoch,
    largestTx,
    cycles,
    maxCyclesInEpoch,
    maxCycles,
  } = transaction

  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const formatConfirmation = useFormatConfirmation()
  let confirmation = 0
  const isProfessional = layout === LayoutLiteProfessional.Professional

  if (tipBlockNumber && blockNumber) {
    // FIXME: the type conversion should be removed once the type declaration is fixed to number
    confirmation = Number(tipBlockNumber) - Number(blockNumber)
  }

  const blockHeightData: CardCellInfo = {
    title: t('block.block_height'),
    tooltip: t('glossary.block_height'),
    // FIXME: the type conversion should be removed once the type declaration is fixed to number
    content: <TransactionBlockHeight blockNumber={Number(blockNumber)} txStatus={txStatus} />,
    className: styles.firstCardCell,
  }
  const timestampData: CardCellInfo = {
    title: t('block.timestamp'),
    tooltip: t('glossary.timestamp'),
    content: parseSimpleDate(blockTimestamp),
  }
  const feeWithFeeRateData: CardCellInfo = {
    title: `${t('transaction.transaction_fee')} | ${t('transaction.fee_rate')}`,
    content: (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Capacity capacity={shannonToCkb(transactionFee)} />
        <span
          style={{
            whiteSpace: 'pre',
          }}
        >{` | ${new BigNumber(transactionFee).multipliedBy(1000).dividedToIntegerBy(bytes).toFormat({
          groupSeparator: ',',
          groupSize: 3,
        })} shannons/kB`}</span>
      </div>
    ),
  }
  const txFeeData: CardCellInfo = {
    title: t('transaction.transaction_fee'),
    content: <Capacity capacity={shannonToCkb(transactionFee)} />,
  }
  const txStatusData: CardCellInfo = {
    title: t('transaction.status'),
    tooltip: t('glossary.transaction_status'),
    content: formatConfirmation(confirmation),
  }

  const liteTxSizeDataContent = bytes ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {`${(bytes - 4).toLocaleString('en')} Bytes`}
      <ComparedToMaxTooltip
        numerator={bytes}
        maxInEpoch={largestTxInEpoch}
        maxInChain={largestTx}
        titleInEpoch={t('transaction.compared_to_the_max_size_in_epoch')}
        titleInChain={t('transaction.compared_to_the_max_size_in_chain')}
        unit="Bytes"
      >
        {t('transaction.size_in_block', {
          bytes: bytes.toLocaleString('en'),
        })}
      </ComparedToMaxTooltip>
    </div>
  ) : (
    ''
  )
  const liteTxSizeData: CardCellInfo = {
    title: t('transaction.size'),
    content: liteTxSizeDataContent,
  }
  const liteTxCyclesDataContent = cycles ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {`${cycles.toLocaleString('en')}`}
      <ComparedToMaxTooltip
        numerator={cycles}
        maxInEpoch={maxCyclesInEpoch}
        maxInChain={maxCycles}
        titleInEpoch={t('transaction.compared_to_the_max_cycles_in_epoch')}
        titleInChain={t('transaction.compared_to_the_max_cycles_in_chain')}
      />
    </div>
  ) : (
    '-'
  )
  const liteTxCyclesData: CardCellInfo = {
    title: t('transaction.cycles'),
    content: liteTxCyclesDataContent,
  }
  const overviewItems: CardCellInfo<'left' | 'right'>[] = []
  if (txStatus === 'committed') {
    overviewItems.push(blockHeightData, timestampData)
    if (confirmation >= 0) {
      if (isProfessional) {
        overviewItems.push(bytes ? feeWithFeeRateData : txFeeData, txStatusData)
      } else {
        overviewItems.push(txStatusData)
      }
    }
  } else if (txStatus === 'rejected') {
    overviewItems.push(
      blockHeightData,
      {
        ...timestampData,
        content: 'Rejected',
      },
      {
        ...txStatusData,
        content: 'Rejected',
        contentTooltip: detailedMessage,
      },
    )
  } else {
    // pending
    overviewItems.push(
      {
        ...blockHeightData,
        content: '···',
      },
      {
        ...timestampData,
        content: '···',
      },
      {
        ...txStatusData,
        content: 'Pending',
      },
    )
  }
  if (isProfessional) {
    overviewItems.push(liteTxSizeData, liteTxCyclesData)
  }

  if (transaction.rgbTransferStep) {
    overviewItems.push({
      title: 'RGB++',
      content: t(`rgbpp.transaction.step.${transaction.rgbTransferStep}`),
    })
  }

  const setToast = useSetToast()

  const handleExportTxClick = async () => {
    const raw = await explorerService.api.fetchTransactionRaw(txHash).catch(error => {
      setToast({ message: error.message })
    })
    if (typeof raw !== 'object') return

    const blob = new Blob([JSON.stringify(raw, null, 2)])

    const link = document.createElement('a')
    link.download = `tx-${txHash}.json`
    link.href = URL.createObjectURL(blob)
    document.body.append(link)
    link.click()
    link.remove()
  }

  return (
    <Card className={styles.transactionOverviewCard}>
      <HashCardHeader
        title={t('transaction.transaction')}
        hash={txHash}
        customActions={[
          <Tooltip placement="top" title={t(`transaction.export-transaction`)}>
            <SimpleButton className={styles.exportTxAction} onClick={handleExportTxClick}>
              <DownloadIcon />
            </SimpleButton>
          </Tooltip>,
        ]}
        rightContent={
          isRGB ? (
            <div className={styles.rgbPlus}>
              <span>RGB++</span>
            </div>
          ) : null
        }
      />

      {(txStatus !== 'committed' || Number(blockTimestamp) > 0) && (
        <TransactionOverviewPanel>
          <CardCellsLayout type="left-right" cells={overviewItems} borderTop={!isMobile} />
          {isProfessional && (
            <div>
              <div className={styles.toggles}>
                <SimpleButton
                  className={styles.paramsToggle}
                  onClick={() => setDetailTab(p => (p === 'params' ? null : 'params'))}
                >
                  <div>{t('transaction.transaction_parameters')}</div>
                  <div className={styles.expandArrow} data-expanded={detailTab === 'params'} />
                </SimpleButton>
                <SimpleButton
                  className={styles.paramsToggle}
                  onClick={() => setDetailTab(p => (p === 'raw' ? null : 'raw'))}
                >
                  <div>{t('transaction.raw_transaction')}</div>
                  <div className={styles.expandArrow} data-expanded={detailTab === 'raw'} />
                </SimpleButton>
              </div>
              {detailTab === 'params' ? <TransactionParameters hash={txHash} /> : null}
              {detailTab === 'raw' ? <RawTransactionView hash={txHash} /> : null}
            </div>
          )}
        </TransactionOverviewPanel>
      )}
    </Card>
  )
}
