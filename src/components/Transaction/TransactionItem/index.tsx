import React from 'react'
import { Link } from 'react-router-dom'
import { TransactionsItem, TransactionConfirmation } from './styled'
import { parseDate } from '../../../utils/date'
import InputOutputIcon from '../../../assets/input_arrow_output.png'
import { Transaction, InputOutput } from '../../../http/response/Transaction'
import TransactionCellList from '../TransactionCellList/index'
import { shannonToCkb } from '../../../utils/util'
import i18n from '../../../utils/i18n'

const MAX_CONFIRMATION = 1000

const handleCellCapacity = (cells: InputOutput[], address?: string) => {
  if (!cells || cells.length === 0) return 0
  return cells
    .filter((cell: InputOutput) => cell.address_hash === address)
    .map((cell: InputOutput) => cell.capacity)
    .reduce((previous: number, current: number) => {
      return previous + current
    }, 0)
}

const handleCapacityChange = (transaction: Transaction, address?: string) => {
  if (!transaction) return 0
  return (
    handleCellCapacity(transaction.display_outputs, address) - handleCellCapacity(transaction.display_inputs, address)
  )
}

const formatConfirmation = (confirmation: number | undefined) => {
  const unit: string = i18n.t('details.confirmation')
  if (!confirmation) {
    return `0 ${unit}`
  }
  return confirmation > MAX_CONFIRMATION ? `${MAX_CONFIRMATION}+ ${unit}` : `${confirmation} ${unit}`
}

const TransactionItem = ({
  transaction,
  address,
  confirmation,
  isBlock = false,
}: {
  transaction: Transaction
  address?: string
  confirmation: number
  isBlock?: boolean
}) => {
  const capacityChangeValue = handleCapacityChange(transaction, address)

  return (
    <TransactionsItem>
      <div>
        <div className="transaction__hash__panel">
          <Link to={`/transaction/${transaction.transaction_hash}`}>
            <code className="transaction_hash">{transaction.transaction_hash}</code>
          </Link>
          {!isBlock && (
            <div className="transaction_block">
              {`(Block ${transaction.block_number})  ${parseDate(transaction.block_timestamp)}`}
            </div>
          )}
        </div>
        <span className="transaction__separate" />
        <div className="transaction__input__output">
          <div className="transaction__input">
            <TransactionCellList cells={transaction.display_inputs} transaction={transaction} address={address} />
          </div>
          <img src={InputOutputIcon} alt="input and output" />
          <div className="transaction__output">
            <TransactionCellList
              cells={transaction.display_outputs}
              transaction={transaction}
              address={address}
              isOuput
            />
            {address && (
              <TransactionConfirmation increased={capacityChangeValue >= 0}>
                <div className="confirmation">{formatConfirmation(confirmation)}</div>
                <div className="capacity">
                  {`${capacityChangeValue >= 0 ? '+' : '-'} ${shannonToCkb(Math.abs(capacityChangeValue))} CKB`}
                </div>
              </TransactionConfirmation>
            )}
          </div>
        </div>
      </div>
    </TransactionsItem>
  )
}

export default TransactionItem
