import React from 'react'
import { Link } from 'react-router-dom'
import { TransactionsCell, TransactionsItem, CellHash, CellHashHighLight, CellbasePanel } from './styled'
import { parseDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { startEndEllipsis } from '../../utils/string'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { InputOutput, Transaction } from '../../http/response/Transaction'
import HelpIcon from '../../assets/qa_help.png'

const Cellbase = ({ blockHeight }: { blockHeight: number }) => {
  return (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${blockHeight}`}>
        <CellHashHighLight>{blockHeight}</CellHashHighLight>
      </Link>
      <div className="cellbase__help">
        <img alt="cellbase help" src={HelpIcon} />
        <div className="cellbase__help__content">
          The cellbase transaction of block N is send to the miner of block N-11 as reward. The reward is consist of
          Base Reward, Commit Reward and Proposal Reward, learn more from our Consensus Protocol
        </div>
      </div>
    </CellbasePanel>
  )
}

const TransactionCell = ({ cell, blockNumber, address }: { cell: any; blockNumber: number; address?: string }) => {
  const CellbaseAddress = () => {
    return address === cell.address_hash || cell.from_cellbase ? (
      <div className="transaction__cell">
        <CellHash>
          {cell.from_cellbase ? <Cellbase blockHeight={blockNumber} /> : startEndEllipsis(cell.address_hash)}
        </CellHash>
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
          <CellHash>
            {cell.from_cellbase ? <Cellbase blockHeight={blockNumber} /> : 'Unable to decode address'}
          </CellHash>
        </div>
      )}
      {!cell.from_cellbase && <div className="transaction__cell__capacity">{`${shannonToCkb(cell.capacity)} CKB`}</div>}
    </TransactionsCell>
  )
}

const BlockReward = ({ name, capacity }: { name: string; capacity: number }) => {
  return (
    <TransactionsCell>
      <div className="transaction__cell">{name}</div>
      <div className="transaction__cell__capacity">{`${shannonToCkb(capacity)} CKB`}</div>
    </TransactionsCell>
  )
}

const BlockRewards = [
  {
    name: 'Base Reward',
    capacity: 300,
  },
  {
    name: 'Commit Reward',
    capacity: 300,
  },
  {
    name: 'Proposal Reward',
    capacity: 300,
  },
]

const TransactionComponent = ({
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
                      blockNumber={transaction.block_number}
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
                      {transaction.block_number > 0 &&
                        BlockRewards.map(blockReward => {
                          return (
                            <BlockReward
                              name={blockReward.name}
                              capacity={blockReward.capacity}
                              key={blockReward.name}
                            />
                          )
                        })}
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

export default TransactionComponent
