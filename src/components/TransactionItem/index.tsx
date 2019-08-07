import React from 'react'
import { Link } from 'react-router-dom'
import RightArrowIcon from '../../assets/input_arrow_output.png'
import DownArrowIcon from '../../assets/input_arrow_output_down.png'
import { parseDate } from '../../utils/date'
import { localeNumberString, parseNumber } from '../../utils/number'
import { isLargeMobile, isMediumMobile, isMobile, isSmallMobile } from '../../utils/screen'
import { startEndEllipsis } from '../../utils/string'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionConfirmation from './TransactionConfirmation'
import TransactionReward from './TransactionReward'
import { FullPanel, TransactionHashBlockPanel, TransactionInputOutputPanel, TransactionPanel } from './styled'

const MAX_CELL_SHOW_SIZE = 10

const handleTransactionHashText = (transactionHash: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(transactionHash, 12)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(transactionHash, 19)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(transactionHash, 24)
  }
  return transactionHash
}

const handleCellCapacity = (cells: State.InputOutput[], address?: string) => {
  if (!cells || cells.length === 0) return 0
  return cells
    .filter((cell: State.InputOutput) => cell.address_hash === address)
    .map((cell: State.InputOutput) => parseNumber(cell.capacity))
    .reduce((previous: number, current: number) => {
      return previous + current
    }, 0)
}

const handleCapacityChange = (transaction: State.Transaction, address?: string) => {
  if (!transaction) return 0
  return (
    handleCellCapacity(transaction.display_outputs, address) - handleCellCapacity(transaction.display_inputs, address)
  )
}

const TransactionItem = ({
  transaction,
  address,
  confirmation,
  isBlock = false,
  isLastItem = false,
}: {
  transaction: State.Transaction
  address?: string
  confirmation?: number
  isBlock?: boolean
  isLastItem?: boolean
}) => {
  return (
    <TransactionPanel isLastItem={isLastItem}>
      <TransactionHashBlockPanel>
        <div className="transaction_item__content">
          <Link to={`/transaction/${transaction.transaction_hash}`}>
            <code className="transaction_item__hash">{handleTransactionHashText(transaction.transaction_hash)}</code>
          </Link>
          {!isBlock && (
            <div className="transaction_item__block">
              {`(Block ${localeNumberString(transaction.block_number)})  ${parseDate(transaction.block_timestamp)}`}
            </div>
          )}
        </div>
      </TransactionHashBlockPanel>
      <TransactionInputOutputPanel>
        <div className="transaction_item__input">
          <TransactionCellList
            cells={transaction.display_inputs}
            showSize={MAX_CELL_SHOW_SIZE}
            transaction={transaction}
            render={cell => {
              return <TransactionCell cell={cell} address={address} key={cell.id} />
            }}
          />
        </div>
        <img src={isMobile() ? DownArrowIcon : RightArrowIcon} alt="input and output" />
        <div className="transaction_item__output">
          <TransactionCellList
            cells={transaction.display_outputs}
            showSize={MAX_CELL_SHOW_SIZE}
            transaction={transaction}
            render={cell => (
              <FullPanel key={cell.id}>
                <TransactionCell cell={cell} address={address} />
                <TransactionReward transaction={transaction} cell={cell} />
              </FullPanel>
            )}
          />
        </div>
      </TransactionInputOutputPanel>
      {confirmation && (
        <TransactionConfirmation confirmation={confirmation} capacity={handleCapacityChange(transaction, address)} />
      )}
    </TransactionPanel>
  )
}

export default TransactionItem
