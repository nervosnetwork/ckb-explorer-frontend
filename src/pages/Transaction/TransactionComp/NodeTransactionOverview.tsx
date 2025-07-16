import { useState, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ccc } from '@ckb-ccc/core'
import { useQuery } from '@tanstack/react-query'
import { Link } from '../../../components/Link'
import Capacity from '../../../components/Capacity'
import SimpleButton from '../../../components/SimpleButton'
import { parseSimpleDate } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkb, useFormatConfirmation } from '../../../utils/util'
import {
  getTransactionOutputCells,
  calculateFeeByTxIO,
  checkIsCellBase,
  calculateTransactionSize,
} from '../../../utils/transaction'
import { useLatestBlockNumber } from '../../../services/ExplorerService'
import { NodeRpc } from '../../../services/NodeService'
import { Card, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../../components/Card'
import RawTransactionView from '../../../components/RawTransactionView'
import { ReactComponent as DownloadIcon } from './download.svg'
import { useIsMobile } from '../../../hooks'
import { useCKBNode } from '../../../hooks/useCKBNode'
import styles from './TransactionOverview.module.scss'
import TransactionParameters from '../../../components/TransactionParameters'
import Tooltip from '../../../components/Tooltip'
import baseStyles from './styles.module.scss'

const showTxStatus = (txStatus: string) => txStatus?.replace(/^\S/, s => s.toUpperCase()) ?? '-'
const TransactionBlockHeight = ({
  status,
  blockNumber,
}: {
  status: NodeRpc.TransactionWithStatus['status']
  blockNumber?: string
}) => {
  if (!blockNumber || status !== 'committed') {
    return (
      <div className={baseStyles.transactionBlockHeightPanel}>
        <span>{showTxStatus(status)}</span>
      </div>
    )
  }

  return (
    <div className={baseStyles.transactionBlockHeightPanel}>
      <Link to={`/block/${parseInt(blockNumber, 10)}`}>{localeNumberString(blockNumber)}</Link>
    </div>
  )
}

export const NodeTransactionOverviewCard: FC<{
  transactionWithStatus: NodeRpc.TransactionWithStatus
}> = ({ transactionWithStatus }) => {
  const { transaction, status: txStatus, cycles, blockNumber, reason } = transactionWithStatus
  const { nodeService } = useCKBNode()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const tipBlockNumber = useLatestBlockNumber()
  const [detailTab, setDetailTab] = useState<'params' | 'raw' | null>(null)
  const txHash = transaction.hash()

  const header = useQuery(
    ['node', 'header', blockNumber?.toString()],
    () => (blockNumber ? nodeService.rpc.getHeaderByNumber(blockNumber?.toString()) : null),
    {
      staleTime: Infinity,
      enabled: blockNumber !== undefined,
    },
  )

  const inputCells = useQuery(
    ['node', 'inputCells', transaction.hash()],
    () => (transaction ? nodeService.getInputCells(transaction.inputs?.map(i => i.previousOutput)) : []),
    {
      enabled: !!transaction,
    },
  )

  const confirmation = (() => {
    if (tipBlockNumber && txStatus === 'committed' && blockNumber) {
      return Number(tipBlockNumber) - Number(blockNumber.toString())
    }

    return 0
  })()
  const formatConfirmation = useFormatConfirmation()

  if (!transaction) {
    return null
  }

  const isCellBase = checkIsCellBase(transaction)
  const txSize = calculateTransactionSize(transaction)
  const outputCells = getTransactionOutputCells(transaction)
  const { fee, feeRate } =
    inputCells.data && !isCellBase
      ? calculateFeeByTxIO(inputCells.data, outputCells, txSize)
      : {
          fee: 0,
          feeRate: 0,
        }

  const blockHeightData: CardCellInfo = {
    title: t('block.block_height'),
    tooltip: t('glossary.block_height'),
    content: <TransactionBlockHeight status={txStatus} blockNumber={blockNumber?.toString()} />,
    className: styles.firstCardCell,
  }

  const timestampData: CardCellInfo = {
    title: t('block.timestamp'),
    tooltip: t('glossary.timestamp'),
    content: header.isLoading || !header.data ? '...' : parseSimpleDate(header.data.timestamp.toString()),
  }

  const feeWithFeeRateData: CardCellInfo = {
    title: `${t('transaction.transaction_fee')} | ${t('transaction.fee_rate')}`,
    content: (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Capacity capacity={shannonToCkb(fee)} />
        <span
          style={{
            whiteSpace: 'pre',
          }}
        >{` | ${Number(feeRate).toLocaleString('en')} shannons/kB`}</span>
      </div>
    ),
  }

  const txStatusData: CardCellInfo = {
    title: t('transaction.status'),
    tooltip: t('glossary.transaction_status'),
    content: formatConfirmation(confirmation),
  }

  const txSizeData: CardCellInfo = {
    title: t('transaction.size'),
    content: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {`${(txSize - 4).toLocaleString('en')} Bytes`}
      </div>
    ),
  }

  const txCyclesData: CardCellInfo = {
    title: t('transaction.cycles'),
    content: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {`${Number(cycles).toLocaleString('en')}`}
      </div>
    ),
  }

  const overviewItems: CardCellInfo<'left' | 'right'>[] = (() => {
    if (txStatus === 'committed') {
      return [
        blockHeightData,
        timestampData,
        ...(confirmation >= 0 ? [feeWithFeeRateData, txStatusData] : []),
        txSizeData,
        txCyclesData,
      ]
    }

    if (txStatus === 'rejected') {
      return [
        blockHeightData,
        {
          ...timestampData,
          content: 'Rejected',
        },
        {
          ...txStatusData,
          content: 'Rejected',
          contentTooltip: reason,
        },
        txSizeData,
        txCyclesData,
      ]
    }

    return [
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
      txSizeData,
      txCyclesData,
    ]
  })()

  const handleExportTxClick = () => {
    const blob = new Blob([ccc.stringify(transaction)])

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
          <Tooltip
            trigger={
              <SimpleButton className={styles.exportTxAction} onClick={handleExportTxClick}>
                <DownloadIcon />
              </SimpleButton>
            }
            placement="top"
          >
            {t(`transaction.export-transaction`)}
          </Tooltip>,
        ]}
      />

      <div className={baseStyles.transactionOverviewPanel}>
        <CardCellsLayout type="left-right" cells={overviewItems} borderTop={!isMobile} />
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
      </div>
    </Card>
  )
}
