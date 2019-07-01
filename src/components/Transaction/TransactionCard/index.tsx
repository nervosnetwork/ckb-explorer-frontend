import React from 'react'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../../http/response/Transaction'
import GreenArrowDown from '../../../assets/green_arrow_down.png'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb, handleCapacityChange } from '../../../utils/util'
import PaginationList from '../TransactionCellList'
import ConfirmationCapacityContainer from '../TransactionConfirmation'
import { localeNumberString } from '../../../utils/number'
import TransactionReward from '../TransactionReward'
import { CardPanel, CellbasePanel, CellHashHighLight, CardItemPanel } from './styled'
import i18n from '../../../utils/i18n'

const MAX_CELL_SHOW_SIZE = 10

const CardLabelItem = ({ value, to, highLight = false }: { value: string; to?: string; highLight?: boolean }) => {
  return (
    <CardItemPanel highLight={highLight}>
      {to ? (
        <Link to={to}>
          <code className="card__value">{value}</code>
        </Link>
      ) : (
        <code className="card__value">{value}</code>
      )}
    </CardItemPanel>
  )
}

const Cellbase = ({ blockHeight }: { blockHeight?: number }) => {
  return blockHeight && blockHeight > 0 ? (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${blockHeight}`}>
        <CellHashHighLight>{blockHeight}</CellHashHighLight>
      </Link>
    </CellbasePanel>
  ) : (
    <span>Cellbase</span>
  )
}

const AddressHashItem = (input: InputOutput, address?: string) => {
  if (input.from_cellbase) {
    if (input.target_block_number && input.target_block_number > 0) {
      return <Cellbase blockHeight={input.target_block_number} />
    }
    return <CardLabelItem key={input.id} value="Cellbase" />
  }
  const Capacity = () => <CardLabelItem value={`${localeNumberString(shannonToCkb(input.capacity))} CKB`} />

  if (input.address_hash) {
    if (address && input.address_hash === address) {
      return (
        <div key={input.id}>
          <CardLabelItem value={`${startEndEllipsis(input.address_hash, 14)}`} />
          <Capacity />
        </div>
      )
    }
    return (
      <div key={input.id}>
        <CardLabelItem
          value={`${startEndEllipsis(input.address_hash, 14)}`}
          to={`/address/${input.address_hash}`}
          highLight
        />
        <Capacity />
      </div>
    )
  }
  return (
    <div key={input.id}>
      <CardLabelItem value={i18n.t('address.unable_decode_address')} />
      <Capacity />
    </div>
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
      <CardLabelItem
        value={`${startEndEllipsis(transaction.transaction_hash, 14)}`}
        to={`/transaction/${transaction.transaction_hash}`}
        highLight
      />
      <div className="sperate__line_top" />
      {transaction && transaction.display_inputs && (
        <PaginationList
          data={transaction.display_inputs}
          pageSize={MAX_CELL_SHOW_SIZE}
          render={input => <div key={input.id}>{AddressHashItem(input, address)}</div>}
        />
      )}
      <div className="green__arrow">
        <img src={GreenArrowDown} alt="arrow" />
      </div>
      {transaction && transaction.display_outputs && (
        <PaginationList
          data={transaction.display_outputs}
          pageSize={MAX_CELL_SHOW_SIZE}
          render={output => {
            return (
              <div key={output.id}>
                {AddressHashItem(output, address)}
                <TransactionReward transaction={transaction} cell={output} />
              </div>
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
