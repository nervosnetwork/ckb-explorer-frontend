import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useAppState } from '../../contexts/providers/index'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import { TransactionBlockHeightPanel, TransactionInfoItemPanel, TransactionInfoContentPanel } from './styled'
import TransactionCellList from './TransactionCellList'
import DecimalCapacity from '../../components/DecimalCapacity'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import { PAGE_CELL_COUNT } from '../../utils/const'
import { isMobile } from '../../utils/screen'

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

const transactionParamsIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const TransactionInfoComp = ({ title, value, linkUrl }: { title: string; value: string; linkUrl?: string }) => {
  return (
    <div className="transaction__info__content_item">
      <span className="transaction__info__content_title">{`${title}: `}</span>
      {linkUrl ? <Link to={linkUrl}>{value}</Link> : <span className="transaction__info__content_value">{value}</span>}
    </div>
  )
}

export default () => {
  const [showParams, setShowParams] = useState<boolean>(false)
  const { hash } = useLocation()
  const { transactionState, app } = useAppState()
  const { transaction } = transactionState
  const { cellDeps, headerDeps, witnesses, transactionHash, displayOutputs } = transaction
  const { tipBlockNumber } = app

  useEffect(() => {
    let anchor = hash
    if (anchor) {
      anchor = anchor.replace('#', '')
      let outputIndex = Number(anchor)
      if (
        Number.isNaN(outputIndex) ||
        outputIndex < 0 ||
        outputIndex >= Math.min(displayOutputs.length, PAGE_CELL_COUNT)
      ) {
        outputIndex = 0
      }
      const anchorElement = document.getElementById(`output_${outputIndex}_${transactionHash}`) as HTMLElement
      if (anchorElement) {
        anchorElement.style.cssText += 'background: #f5f5f5'
        anchorElement.scrollIntoView()
        window.scrollBy(0, isMobile() ? -48 : -66)
      }
    }
  }, [hash, displayOutputs.length, transactionHash])

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
            <div
              className="transaction__overview_parameters"
              role="button"
              tabIndex={0}
              onKeyUp={() => {}}
              onClick={() => setShowParams(!showParams)}
            >
              <div>{i18n.t('transaction.transaction_parameters')}</div>
              <img alt="transaction parameters" src={transactionParamsIcon(showParams)} />
            </div>
            {showParams &&
              transactionInfo.map(item => {
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
        {transaction && <TransactionCellList inputs={transaction.displayInputs} txHash={transaction.transactionHash} />}
      </div>
      <div className="transaction__outputs">
        {transaction && (
          <TransactionCellList outputs={transaction.displayOutputs} txHash={transaction.transactionHash} />
        )}
      </div>
    </>
  )
}
