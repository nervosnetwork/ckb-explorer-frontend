import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { AppContext } from '../../contexts/providers/index'
import { AppDispatch } from '../../contexts/providers/reducer'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import { TransactionBlockHeightPanel } from './styled'
import TransactionCellList from './TransactionCellList'

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

export default ({ dispatch }: { dispatch: AppDispatch }) => {
  const { transactionState, app } = useContext(AppContext)
  const { transaction } = transactionState
  const { tipBlockNumber } = app

  let confirmation = 0
  if (tipBlockNumber && transaction.blockNumber) {
    confirmation = tipBlockNumber - transaction.blockNumber + 1
  }

  const overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: <TransactionBlockHeight blockNumber={transaction.blockNumber} />,
    },
    {
      title: i18n.t('block.timestamp'),
      content: parseSimpleDate(transaction.blockTimestamp),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: `${shannonToCkb(transaction.transactionFee)} CKB`,
    },
  ]
  if (confirmation > 0) {
    overviewItems.push({
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    })
  }

  return (
    <>
      <div className="transaction__overview">
        <OverviewCard items={overviewItems} />
      </div>
      <div className="transaction__inputs">
        {transaction && <TransactionCellList inputs={transaction.displayInputs} dispatch={dispatch} />}
      </div>
      <div className="transaction__outputs">
        {transaction && <TransactionCellList outputs={transaction.displayOutputs} dispatch={dispatch} />}
      </div>
    </>
  )
}
