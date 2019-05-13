import React from 'react'
import { Link } from 'react-router-dom'
import { TransactionsCell, TransactionsItem, CellHash, CellHashHighLight, CellHashEnd, CellHashEndHighLight } from './styled'
import { parseDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import InputOutputIcon from '../../asserts/input_arrow_output.png'

const TransactionCell = ({ cell, address }: { cell: any; address?: string }) => {
  return (
    <TransactionsCell>
      {
        address === cell.address_hash? (
          <div className="transaction__cell">
            <CellHash>{cell.address_hash}</CellHash>
            <CellHashEnd>{cell.address_hash && cell.address_hash.substr(cell.address_hash.length-12, 12)}</CellHashEnd>
          </div>
        ) : (
          <Link to={`/address/${cell.address_hash}`}>
            <div className="transaction__cell">
              <CellHashHighLight>{cell.address_hash}</CellHashHighLight>
              <CellHashEndHighLight>{cell.address_hash && cell.address_hash.substr(cell.address_hash.length-12, 12)}</CellHashEndHighLight>
            </div>
          </Link>
        )
      }
      <div className="transaction__cell__capacity">{`${shannonToCkb(cell.capacity)} CKB`}</div>
    </TransactionsCell>
  )
}

const TransactionComponent = ({ transaction, address }: { transaction: any; address?: string }) => {
  return (
    <TransactionsItem>
      <div className="transaction__hash__panel">
        <Link to={`/transaction/${transaction.transaction_hash}`}>
          <div className="transaction_hash">{transaction.transaction_hash}</div>
        </Link>
        <div className="transaction_block">
          {`(Block ${transaction.block_number})  ${parseDate(transaction.block_timestamp)}`}
        </div>
      </div>
      <span className="transaction__separate" />
      <div className="transaction__input__output">
        <div className="transaction__input">
          {transaction.display_inputs.map((cell: any) => {
            return <TransactionCell cell={cell} address={address} key={cell.id} />
          })}
        </div>
        <img src={InputOutputIcon} alt="input and output" />
        <div className="transaction__output">
          {transaction.display_outputs.map((cell: any) => {
            return <TransactionCell cell={cell} address={address} key={cell.id} />
          })}
        </div>
      </div>
    </TransactionsItem>
  )
}

export default TransactionComponent
