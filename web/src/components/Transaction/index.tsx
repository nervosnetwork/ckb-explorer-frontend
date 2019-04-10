import React from 'react'
import { TransactionsCell, TransactionsItem } from './index.css'
import { parseDate } from '../../utils/date'
import InputOutputIcon from '../../asserts/input_arrow_output.png'

const TransactionCell = ({ cell }: { cell: any }) => {
  return (
    <TransactionsCell>
      <div className="transaction__cell__hash">{cell.address_hash}</div>
      <div className="transaction__cell__capacity">{`${cell.capacity} CKB`}</div>
    </TransactionsCell>
  )
}

const Transaction = ({ transaction }: { transaction: any }) => {
  return (
    <TransactionsItem>
      <div className="transaction__hash__panel">
        <div className="transaction_hash">{transaction.transaction_hash}</div>
        <div className="transaction_block">
          {`(Block ${transaction.block_number})  ${parseDate(transaction.block_timestamp)}`}
        </div>
      </div>
      <span className="transaction__separate" />
      <div className="transaction__input__output">
        <div className="transaction__input">
          {transaction.display_inputs.map((cell: any) => {
            return <TransactionCell cell={cell} key={cell.input_id} />
          })}
        </div>
        <img src={InputOutputIcon} alt="input and output" />
        <div className="transaction__output">
          {transaction.display_outputs.map((cell: any) => {
            return <TransactionCell cell={cell} key={cell.output_id} />
          })}
        </div>
      </div>
    </TransactionsItem>
  )
}

export default Transaction
