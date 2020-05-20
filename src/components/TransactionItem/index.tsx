import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import RightArrowIcon from '../../assets/input_arrow_output.png'
import DownArrowIcon from '../../assets/input_arrow_output_down.png'
import { parseDate } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionConfirmation from './TransactionConfirmation'
import TransactionReward from './TransactionReward'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import i18n from '../../utils/i18n'
import { CellType } from '../../utils/const'

const TransactionItem = ({
  transaction,
  address,
  confirmation,
  isBlock = false,
  isLastItem = false,
  titleCard,
}: {
  transaction: State.Transaction
  address?: string
  confirmation?: number
  isBlock?: boolean
  isLastItem?: boolean
  titleCard?: ReactNode | null
}) => {
  const txHashMobile = adaptMobileEllipsis(transaction.transactionHash, 12)
  const txHashPC = adaptPCEllipsis(transaction.transactionHash, 14, 40)

  return (
    <TransactionPanel isLastItem={isLastItem} id={isBlock && transaction.isCellbase ? 'cellbase' : ''}>
      {titleCard}
      <TransactionHashBlockPanel>
        <div className="transaction_item__content">
          <Link to={`/transaction/${transaction.transactionHash}`}>
            <span className="transaction_item__hash monospace">{isMobile() ? txHashMobile : txHashPC}</span>
          </Link>
          {!isBlock && (
            <div className="transaction_item__block">
              {`(${i18n.t('block.block')} ${localeNumberString(transaction.blockNumber)})  ${parseDate(
                transaction.blockTimestamp,
              )}`}
            </div>
          )}
        </div>
      </TransactionHashBlockPanel>
      <TransactionCellPanel>
        <div className="transaction_item__input">
          <TransactionCellList
            cells={transaction.displayInputs}
            transaction={transaction}
            render={cell => <TransactionCell cell={cell} address={address} cellType={CellType.Input} key={cell.id} />}
          />
        </div>
        <img src={isMobile() ? DownArrowIcon : RightArrowIcon} alt="input and output" />
        <div className="transaction_item__output">
          {transaction.displayOutputs && transaction.displayOutputs.length !== 0 ? (
            <TransactionCellList
              cells={transaction.displayOutputs}
              transaction={transaction}
              render={cell => (
                <FullPanel key={cell.id}>
                  <TransactionCell cell={cell} address={address} cellType={CellType.Output} />
                  <TransactionReward transaction={transaction} cell={cell} />
                </FullPanel>
              )}
            />
          ) : (
            <div className="transaction_item__output__empty">{i18n.t('transaction.empty_output')}</div>
          )}
        </div>
      </TransactionCellPanel>
      {typeof confirmation === 'number' ? (
        <TransactionConfirmation confirmation={confirmation} income={transaction.income} />
      ) : null}
    </TransactionPanel>
  )
}

export default TransactionItem
