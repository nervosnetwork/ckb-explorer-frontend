import React from 'react'
import { Link } from 'react-router-dom'
import { TransactionsItem } from './styled'
import { parseDate } from '../../../utils/date'
import InputOutputIcon from '../../../assets/input_arrow_output.png'
import { InputOutput, Transaction } from '../../../http/response/Transaction'
import TransactionCell from '../TransactionCell/index'
import TransactionReward from '../TransactionReward/index'

const TransactionItem = ({
  transaction,
  address,
  isBlock = false,
}: {
  transaction: Transaction
  address?: string
  isBlock?: boolean
}) => {
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
            {transaction.display_inputs &&
              transaction.display_inputs.map((cell: InputOutput) => {
                return (
                  cell && (
                    <TransactionCell
                      cell={cell}
                      blockNumber={cell.target_block_number}
                      address={address}
                      key={cell.id}
                    />
                  )
                )
              })}
          </div>
          <img src={InputOutputIcon} alt="input and output" />
          <div className="transaction__output">
            {transaction.display_outputs &&
              transaction.display_outputs.map((cell: InputOutput) => {
                return (
                  cell && (
                    <div key={cell.id}>
                      <TransactionCell cell={cell} blockNumber={transaction.block_number} address={address} />
                      <TransactionReward transaction={transaction} cell={cell} />
                    </div>
                  )
                )
              })}
          </div>
        </div>
      </div>
    </TransactionsItem>
  )
}

export default TransactionItem
