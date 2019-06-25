import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { InputOutput } from '../../http/response/Transaction'
import { parseDate } from '../../utils/date'
import { parseNumber } from '../../utils/number'
import { startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  CellContainer,
  CellHash,
  CellHashHighLight,
  TransactionsCell,
  TransactionsItem,
  TransactionConfirmationContainer,
} from './styled'
import { CELL_PAGE_SIZE, CONFIRMATION_MAX } from './const'
import LoadMoreIcon from '../../assets/transaction_load_more.png'

const TransactionCell = ({ cell, address }: { cell: any; address?: string }) => {
  const CellbaseAddress = () => {
    return address === cell.address_hash || cell.from_cellbase ? (
      <div className="transaction__cell">
        <CellHash>{cell.from_cellbase ? 'Cellbase' : startEndEllipsis(cell.address_hash)}</CellHash>
      </div>
    ) : (
      <Link className="transaction__cell__link" to={`/address/${cell.address_hash}`}>
        <CellHashHighLight>{startEndEllipsis(cell.address_hash)}</CellHashHighLight>
      </Link>
    )
  }

  return (
    <TransactionsCell>
      {cell.address_hash ? (
        <CellbaseAddress />
      ) : (
        <div className="transaction__cell">
          <CellHash>{cell.from_cellbase ? 'Cellbase' : 'Unable to decode address'}</CellHash>
        </div>
      )}
      {!cell.from_cellbase && <div className="transaction__cell__capacity">{`${shannonToCkb(cell.capacity)} CKB`}</div>}
    </TransactionsCell>
  )
}

const CellContainerComponent = ({
  cells,
  address,
  pageSize,
  children,
}: {
  cells: [any]
  address?: string
  pageSize: number
  children?: ReactNode
}) => {
  const [count, setCount] = useState(pageSize)
  const onClickLoadMore = () => {
    setCount(Math.min(cells.length, count + pageSize))
  }
  return (
    <CellContainer>
      {cells &&
        cells.map((cell: InputOutput, idx: number) => {
          return idx < count && cell && <TransactionCell cell={cell} address={address} key={cell.id} />
        })}
      {count < cells.length && (
        <button type="button" onClick={onClickLoadMore}>
          Load More
          <img src={LoadMoreIcon} alt="load more" />
        </button>
      )}
      {children}
    </CellContainer>
  )
}

const getCapacityChange = (transaction: { display_inputs: [any]; display_outputs: [any] }, address?: string) => {
  if (!transaction) return 0
  let capacity: number = 0
  transaction.display_inputs.forEach(element => {
    if (element.address_hash === address) {
      capacity -= parseNumber(element.capacity)
    }
  })
  transaction.display_outputs.forEach(element => {
    if (element.address_hash === address) {
      capacity += parseNumber(element.capacity)
    }
  })
  return capacity
}

const formattorConfirmation = (confirmation: number | undefined) => {
  if (!confirmation) return '0 Confirmation'
  if (confirmation! > CONFIRMATION_MAX) {
    return `${CONFIRMATION_MAX}+ Confirmation`
  }
  return `${confirmation} Confirmation`
}

const TransactionComponent = ({
  transaction,
  address,
  isBlock = false,
  confirmation,
}: {
  transaction: any
  address?: string
  isBlock?: boolean
  confirmation?: number
}) => {
  const changeInCapacity = getCapacityChange(transaction, address)
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
          <CellContainerComponent cells={transaction.display_inputs} address={address} pageSize={CELL_PAGE_SIZE} />
          <img src={InputOutputIcon} alt="input and output" />
          <div className="transaction__output">
            <CellContainerComponent cells={transaction.display_outputs} address={address} pageSize={CELL_PAGE_SIZE} />
            {address && <span className="transaction__separate" />}
            {address && (
              <TransactionConfirmationContainer increased={changeInCapacity >= 0}>
                <div className="confirmation">{formattorConfirmation(confirmation)}</div>
                <div className="capacity">
                  {`${changeInCapacity >= 0 ? '+' : '-'} ${shannonToCkb(Math.abs(changeInCapacity))} CKB`}
                </div>
              </TransactionConfirmationContainer>
            )}
          </div>
        </div>
      </div>
    </TransactionsItem>
  )
}

export default TransactionComponent
