import { ReactNode } from 'react'
import RightArrowIcon from '../../assets/input_arrow_output.png'
import DownArrowIcon from '../../assets/input_arrow_output_down.png'
import { parseDate } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { isScreenSmallerThan1200 } from '../../utils/screen'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionIncome from './TransactionIncome'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import i18n from '../../utils/i18n'
import { CellType } from '../../constants/common'
import AddressText from '../AddressText'

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
  return (
    <TransactionPanel id={isBlock && transaction.isCellbase ? 'cellbase' : ''} circleCorner={circleCorner}>
      {titleCard}
      <TransactionHashBlockPanel>
        <div className="transaction_item__content">
          <AddressText
            disableTooltip
            className="transaction_item__hash"
            linkProps={{
              to: `/transaction/${transaction.transactionHash}`,
            }}
          >
            {transaction.transactionHash}
          </AddressText>
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
