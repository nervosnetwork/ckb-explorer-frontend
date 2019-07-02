import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../../http/response/Transaction'
import GreenArrowDown from '../../../assets/green_arrow_down.png'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb, handleCapacityChange } from '../../../utils/util'
import TransactionCellList from '../TransactionCellList'
import ConfirmationCapacityContainer from '../TransactionConfirmation'
import { localeNumberString } from '../../../utils/number'
import TransactionReward from '../TransactionReward'
import { CardPanel, CellbasePanel, CellHashHighLight, FullPanel, CardHashBlockPanel, CardCellPanel } from './styled'
import i18n from '../../../utils/i18n'
import HelpIcon from '../../../assets/qa_help.png'
import Tooltip, { TargetSize } from '../../Tooltip'
import { parseDate } from '../../../utils/date'

const MAX_CELL_SHOW_SIZE = 10

const targetSize: TargetSize = {
  width: 14,
  height: 30,
}
const TooltipContent =
  'The cellbase transaction of block N is send to the miner of block N-11 as reward. The reward is consist of Base Reward, Commit Reward and Proposal Reward, learn more from our Consensus Protocol.'

const Cellbase = ({ blockHeight }: { blockHeight?: number }) => {
  const [show, setShow] = useState(false)
  return blockHeight && blockHeight > 0 ? (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${blockHeight}`}>
        <CellHashHighLight>{localeNumberString(blockHeight)}</CellHashHighLight>
      </Link>
      <div
        className="cellbase__help"
        tabIndex={-1}
        onFocus={() => {}}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <img alt="cellbase help" src={HelpIcon} />
        <Tooltip show={show} targetSize={targetSize} message={TooltipContent} />
      </div>
    </CellbasePanel>
  ) : (
    <CellbasePanel>Cellbase</CellbasePanel>
  )
}

const CardCell = ({ input, address }: { input: InputOutput; address?: string }) => {
  if (input.from_cellbase) {
    return <Cellbase blockHeight={input.target_block_number} />
  }
  let addressText = i18n.t('address.unable_decode_address')
  let highLight = false
  if (input.address_hash) {
    addressText = startEndEllipsis(input.address_hash, 12)
    if (address && input.address_hash !== address) {
      highLight = true
    }
  }
  return (
    <CardCellPanel highLight={highLight} key={input.id}>
      <div className="card__cell_address">
        <span>{addressText}</span>
      </div>
      <div className="card__cell_capacity">{`${localeNumberString(shannonToCkb(input.capacity))} CKB`}</div>
    </CardCellPanel>
  )
}

const TransactionCard = ({
  transaction,
  address,
  confirmation,
}: {
  transaction: Transaction
  address?: string
  confirmation?: number
}) => {
  return (
    <CardPanel>
      <CardHashBlockPanel>
        <div className="card__hash">{transaction.transaction_hash}</div>
        <div className="card__block_date">
          {`(Block ${localeNumberString(transaction.block_number)})  ${parseDate(transaction.block_timestamp)}`}
        </div>
      </CardHashBlockPanel>
      <div className="sperate__line_top" />
      {transaction && transaction.display_inputs && (
        <TransactionCellList
          data={transaction.display_inputs}
          pageSize={MAX_CELL_SHOW_SIZE}
          render={input => <CardCell key={input.id} input={input} address={address} />}
        />
      )}
      <div className="green__arrow">
        <img src={GreenArrowDown} alt="arrow" />
      </div>
      {transaction && transaction.display_outputs && (
        <TransactionCellList
          data={transaction.display_outputs}
          pageSize={MAX_CELL_SHOW_SIZE}
          render={output => {
            return (
              <FullPanel key={output.id}>
                <CardCell input={output} address={address} />
                <TransactionReward transaction={transaction} cell={output} />
              </FullPanel>
            )
          }}
        />
      )}
      {address && <div className="sperate__line_bottom" />}
      {address && (
        <ConfirmationCapacityContainer
          confirmation={confirmation}
          capacity={handleCapacityChange(transaction, address)}
        />
      )}
    </CardPanel>
  )
}

export default TransactionCard
