import React from 'react'
import { Link } from 'react-router-dom'
import { TransactionsItem, TransactionsCell } from './styled'
import { parseDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { InputOutput, Transaction } from '../../http/response/Transaction'
import CellLabelItem from './CellLabel/CellLabelItem'

const BlockReward = ({ name, capacity }: { name: string; capacity: number }) => {
  return (
    <TransactionsCell>
      <div className="transaction__cell">{name}</div>
      <div className="transaction__cell__capacity">{`${shannonToCkb(capacity)} CKB`}</div>
    </TransactionsCell>
  )
}

// genesis block and no cellbase transaction doesn't show block reward
const showBlockReward = (transaction: Transaction): boolean => transaction.block_number > 0 && transaction.is_cellbase

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
                    <CellLabelItem cell={cell} blockNumber={cell.target_block_number} address={address} key={cell.id} />
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
                      <CellLabelItem cell={cell} blockNumber={transaction.block_number} address={address} />
                      {showBlockReward(transaction) && (
                        <div>
                          <BlockReward name="Base Reward" capacity={cell.block_reward} />
                          <BlockReward name="Commit Reward" capacity={cell.commit_reward} />
                          <BlockReward name="Proposal Reward" capacity={cell.proposal_reward} />
                        </div>
                      )}
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
