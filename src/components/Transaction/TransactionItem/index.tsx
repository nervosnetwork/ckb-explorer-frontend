import React from 'react'
import { Link } from 'react-router-dom'
import InputOutputIcon from '../../../assets/input_arrow_output.png'
import { Transaction } from '../../../types/App/index'
import { parseDate } from '../../../utils/date'
import { handleCapacityChange } from '../../../utils/util'
import TransactionCellList from '../TransactionCellList'
import TransactionCell from '../TransactionCell'
import TransactionConfirmation from '../TransactionConfirmation'
import TransactionReward from '../TransactionReward'
import {
  FullPanel,
  SeparationLine,
  TransactionHashBlockPanel,
  TransactionInputOutputPanel,
  TransactionPanel,
} from './styled'
import { localeNumberString } from '../../../utils/number'

const MAX_CELL_SHOW_SIZE = 10

const TransactionItem = ({
  transaction,
  address,
  confirmation,
  isBlock = false,
}: {
  transaction: Transaction
  address?: string
  confirmation?: number
  isBlock?: boolean
}) => {
  return (
    <TransactionPanel>
      <div>
        <TransactionHashBlockPanel>
          <Link to={`/transaction/${transaction.transaction_hash}`}>
            <code className="transaction_item__hash">{transaction.transaction_hash}</code>
          </Link>
          {!isBlock && (
            <div className="transaction_item__block">
              {`(Block ${localeNumberString(transaction.block_number)})  ${parseDate(transaction.block_timestamp)}`}
            </div>
          )}
        </TransactionHashBlockPanel>
        <SeparationLine marginTop="30px" />
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
          <img src={InputOutputIcon} alt="input and output" />
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
            {confirmation && (
              <>
                <SeparationLine marginTop="10px" marginBottom="20px" />
                <TransactionConfirmation
                  confirmation={confirmation}
                  capacity={handleCapacityChange(transaction, address)}
                />
              </>
            )}
          </div>
        </TransactionInputOutputPanel>
      </div>
    </TransactionPanel>
  )
}

export default TransactionItem
