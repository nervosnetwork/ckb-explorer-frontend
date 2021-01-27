import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import RightArrowIcon from '../../assets/input_arrow_output.png'
import DownArrowIcon from '../../assets/input_arrow_output_down.png'
import { parseDate } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { isMobile, isScreenSmallerThan1200 } from '../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionIncome from './TransactionIncome'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import i18n from '../../utils/i18n'
import { CellType } from '../../utils/const'

export interface CircleCorner {
  top?: boolean
  bottom?: boolean
}

const TransactionItem = ({
  transaction,
  address,
  isBlock = false,
  titleCard,
  circleCorner = {
    top: false,
    bottom: false,
  },
}: {
  transaction: State.Transaction
  address?: string
  isBlock?: boolean
  titleCard?: ReactNode | null
  circleCorner?: CircleCorner
}) => {
  const txHashMobile = adaptMobileEllipsis(transaction.transactionHash, 10)
  const txHashPC = adaptPCEllipsis(transaction.transactionHash, 17, 28)

  return (
    <TransactionPanel id={isBlock && transaction.isCellbase ? 'cellbase' : ''} circleCorner={circleCorner}>
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
        <img src={isScreenSmallerThan1200() ? DownArrowIcon : RightArrowIcon} alt="input and output" />
        <div className="transaction_item__output">
          {transaction.displayOutputs && transaction.displayOutputs.length !== 0 ? (
            <TransactionCellList
              cells={transaction.displayOutputs}
              transaction={transaction}
              render={cell => (
                <FullPanel key={cell.id}>
                  <TransactionCell cell={cell} address={address} cellType={CellType.Output} />
                </FullPanel>
              )}
            />
          ) : (
            <div className="transaction_item__output__empty">{i18n.t('transaction.empty_output')}</div>
          )}
        </div>
      </TransactionCellPanel>
      {address && <TransactionIncome income={transaction.income} />}
    </TransactionPanel>
  )
}

export default TransactionItem
