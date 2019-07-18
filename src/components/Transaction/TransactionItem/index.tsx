import React from 'react'
import { Link } from 'react-router-dom'
import RightArrowIcon from '../../../assets/input_arrow_output.png'
import DownArrowIcon from '../../../assets/input_arrow_output_down.png'
import { parseDate } from '../../../utils/date'
import { localeNumberString } from '../../../utils/number'
import { isLargeMobile, isMediumMobile, isMobile, isSmallMobile } from '../../../utils/screen'
import { startEndEllipsis } from '../../../utils/string'
import { handleCapacityChange } from '../../../utils/util'
import TransactionCell from '../TransactionCell'
import TransactionCellList from '../TransactionCellList'
import TransactionConfirmation from '../TransactionConfirmation'
import TransactionReward from '../TransactionReward'
import { FullPanel, TransactionHashBlockPanel, TransactionInputOutputPanel, TransactionPanel } from './styled'

const MAX_CELL_SHOW_SIZE = 10

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
  let transactionHash = transaction.transaction_hash
  if (isSmallMobile()) {
    transactionHash = startEndEllipsis(transaction.transaction_hash, 12)
  } else if (isMediumMobile()) {
    transactionHash = startEndEllipsis(transaction.transaction_hash, 19)
  } else if (isLargeMobile()) {
    transactionHash = startEndEllipsis(transaction.transaction_hash, 24)
  }
  return (
    <TransactionPanel isLastItem={isLastItem}>
      <TransactionHashBlockPanel>
        <div className="transaction_item__content">
          <Link to={`/transaction/${transaction.transaction_hash}`}>
            <code className="transaction_item__hash">{transactionHash}</code>
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
