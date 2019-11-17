import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { AppContext } from '../../contexts/providers/index'
import { AppDispatch } from '../../contexts/providers/reducer'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import { TransactionBlockHeightPanel, TransactionInfoItemPanel, TransactionInfoContentPanel } from './styled'
import TransactionCellList from './TransactionCellList'
import DecimalCapacity from '../../components/DecimalCapacity'

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

const TransactionInfoComp = ({ title, value, linkUrl }: { title: string; value: string; linkUrl?: string }) => {
  return (
    <div className="transaction__info__content_item">
      <span className="transaction__info__content_title">{`${title}: `}</span>
      {linkUrl ? <Link to={linkUrl}>{value}</Link> : <span className="transaction__info__content_value">{value}</span>}
    </div>
  )
}

export default ({ dispatch }: { dispatch: AppDispatch }) => {
  const { transactionState, app } = useContext(AppContext)
  const { transaction } = transactionState
  const { cellDeps, headerDeps, witnesses } = transaction
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
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(transaction.transactionFee))} />,
    },
  ]
  if (confirmation > 0) {
    overviewItems.push({
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    })
  }

  const transactionInfo = []
  if (cellDeps) {
    transactionInfo.push({
      title: i18n.t('transaction.cell_deps'),
      content: cellDeps.map(cellDep => {
        return (
          <TransactionInfoContentPanel key={`${cellDep.outPoint.txHash}${cellDep.outPoint.index}`}>
            <TransactionInfoComp
              title={i18n.t('transaction.out_point_tx_hash')}
              value={cellDep.outPoint.txHash}
              linkUrl={`/transaction/${cellDep.outPoint.txHash}`}
            />
            <TransactionInfoComp title={i18n.t('transaction.out_point_index')} value={cellDep.outPoint.index} />
            <TransactionInfoComp title={i18n.t('transaction.dep_type')} value={cellDep.depType} />
          </TransactionInfoContentPanel>
        )
      }),
    })
  } else {
    transactionInfo.push({
      title: i18n.t('transaction.cell_deps'),
      content: [],
    })
  }
  if (headerDeps) {
    transactionInfo.push({
      title: i18n.t('transaction.header_deps'),
      content: headerDeps.map(headerDep => {
        return (
          <TransactionInfoContentPanel key={headerDep}>
            <TransactionInfoComp
              title={i18n.t('transaction.header_dep')}
              value={headerDep}
              linkUrl={`/block/${headerDep}`}
            />
          </TransactionInfoContentPanel>
        )
      }),
    })
  } else {
    transactionInfo.push({
      title: i18n.t('transaction.header_deps'),
      content: [],
    })
  }
  if (witnesses) {
    transactionInfo.push({
      title: i18n.t('transaction.witnesses'),
      content: witnesses.map(witness => {
        return (
          <TransactionInfoContentPanel key={witness}>
            <TransactionInfoComp title="Witness" value={witness} />
          </TransactionInfoContentPanel>
        )
      }),
    })
  } else {
    transactionInfo.push({
      title: i18n.t('transaction.witnesses'),
      content: [],
    })
  }

  return (
    <>
      <div className="transaction__overview">
        <OverviewCard items={overviewItems}>
          <div className="transaction__overview_info">
            {transactionInfo.map(item => {
              return (
                <TransactionInfoItemPanel key={item.title}>
                  <div className="transaction__info_title">{item.title}</div>
                  <div className="transaction__info_value">
                    {item.content && item.content.length > 0 ? item.content : '[ ]'}
                  </div>
                </TransactionInfoItemPanel>
              )
            })}
          </div>
        </OverviewCard>
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
