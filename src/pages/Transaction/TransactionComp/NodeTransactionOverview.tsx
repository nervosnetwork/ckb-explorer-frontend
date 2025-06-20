import { useState, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ResultFormatter } from '@ckb-lumos/rpc'
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
const TransactionBlockHeight = ({ txStatus }: { txStatus: NodeRpc.TransactionWithStatus['tx_status'] }) => (
  <div className={baseStyles.transactionBlockHeightPanel}>
    {txStatus.status === 'committed' ? (
      <Link to={`/block/${parseInt(txStatus.block_number, 16)}`}>{localeNumberString(txStatus.block_number)}</Link>
    ) : (
      <span>{showTxStatus(txStatus.status)}</span>
    )}
  </div>
)

export const NodeTransactionOverviewCard: FC<{
  transactionWithStatus: NodeRpc.TransactionWithStatus
}> = ({ transactionWithStatus }) => {
  const { transaction: rawTransaction, tx_status: txStatus, cycles } = transactionWithStatus
  const { nodeService } = useCKBNode()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const tipBlockNumber = useLatestBlockNumber()
  const [detailTab, setDetailTab] = useState<'params' | 'raw' | null>(null)

  const header = useQuery(
    ['node', 'header', txStatus.status === 'committed' ? txStatus.block_number : null],
    () => (txStatus.status === 'committed' ? nodeService.rpc.getHeaderByNumber(txStatus.block_number) : null),
    {
      staleTime: Infinity,
      enabled: txStatus.status === 'committed',
    },
  )

  const inputCells = useQuery(
    ['node', 'inputCells', rawTransaction?.hash],
    () => (rawTransaction ? nodeService.getInputCells(ResultFormatter.toTransaction(rawTransaction).inputs) : []),
    {
      enabled: Boolean(rawTransaction),
    },
  )
  const confirmation = (() => {
    if (tipBlockNumber && txStatus.status === 'committed' && txStatus.block_number) {
      return Number(tipBlockNumber) - Number(txStatus.block_number)
    }

    return 0
  })()
  const formatConfirmation = useFormatConfirmation()

  if (!rawTransaction) {
    return null
  }

  const tx = ResultFormatter.toTransaction(rawTransaction)
  const isCellBase = checkIsCellBase(tx)
  const txSize = calculateTransactionSize(tx)
  const outputCells = getTransactionOutputCells(tx)
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
    content: <TransactionBlockHeight txStatus={txStatus} />,
    className: styles.firstCardCell,
  }

  const timestampData: CardCellInfo = {
    title: t('block.timestamp'),
    tooltip: t('glossary.timestamp'),
    content: header.isLoading || !header.data ? '...' : parseSimpleDate(header.data.timestamp),
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
    if (txStatus.status === 'committed') {
      return [
        blockHeightData,
        timestampData,
        ...(confirmation >= 0 ? [feeWithFeeRateData, txStatusData] : []),
        txSizeData,
        txCyclesData,
      ]
    }

    if (txStatus.status === 'rejected') {
      return [
        blockHeightData,
        {
          ...timestampData,
          content: 'Rejected',
        },
        {
          ...txStatusData,
          content: 'Rejected',
          contentTooltip: txStatus.reason,
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
    const blob = new Blob([JSON.stringify(rawTransaction, null, 2)])

    const link = document.createElement('a')
    link.download = `tx-${rawTransaction.hash}.json`
    link.href = URL.createObjectURL(blob)
    document.body.append(link)
    link.click()
    link.remove()
  }

  return (
    <Card className={styles.transactionOverviewCard}>
      <HashCardHeader
        title={t('transaction.transaction')}
        hash={rawTransaction.hash}
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
          {detailTab === 'params' ? <TransactionParameters hash={rawTransaction.hash} /> : null}
          {detailTab === 'raw' ? <RawTransactionView hash={rawTransaction.hash} /> : null}
        </div>
      </div>
    </Card>
  )
}
