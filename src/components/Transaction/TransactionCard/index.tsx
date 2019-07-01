import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../../http/response/Transaction'
import GreenArrowDown from '../../../assets/green_arrow_down.png'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb, getCapacityChange } from '../../../utils/util'
// import { PaginationList, ConfirmationCapacityContainer } from '../Transaction'
import PaginationList from '../PaginationList'
import ConfirmationCapacityContainer from '../ConfirmationCapacity'
import { localeNumberString } from '../../../utils/number'
import TransactionReward from '../TransactionReward'

export const CELL_PAGE_SIZE = 10

const CardPanel = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
  width: 88%;
  background-color: white;
  padding: 10px 6% 20px 6%;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;
  .sperate__line_top {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
  }
  .green__arrow {
    text-align: center;
    margin: 10px 0;
    > img {
      width: 20px;
      height: 20px;
    }
  }
  .sperate__line_bottom {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
    margin-bottom: 10px;
  }
`

const CardItemPanel = styled.div`
  display: flex;
  margin-top: 10px;
  > div {
    color: #606060;
    font-size: 14px;
    margin-right: 8px;
  }
  .card__value {
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-weight: 450;
    font-size: 14px;
  }
  @media (max-width: 320px) {
    > div {
      font-size: 13px;
    }
    .card__value {
      font-size: 12px;
    }
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  margin-top: 10px;
  .cellbase__content {
    color: #888888;
    font-size: 14px;
    margin-right: 10px;
  }
`

const CellHashHighLight = styled.div`
  font-size: 14px;
  color: rgb(75, 188, 142);
`

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
      <CardLabelItem value="Unable to decode address" />
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
          pageSize={CELL_PAGE_SIZE}
          render={input => <div key={input.id}>{AddressHashItem(input, address)}</div>}
        />
      )}
      <div className="green__arrow">
        <img src={GreenArrowDown} alt="arrow" />
      </div>
      {transaction && transaction.display_outputs && (
        <PaginationList
          data={transaction.display_outputs}
          pageSize={CELL_PAGE_SIZE}
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
      <div className="sperate__line_bottom" />
      <ConfirmationCapacityContainer confirmation={confirmation} capacity={getCapacityChange(transaction, address)} />
    </CardPanel>
  )
}

export default TransactionCard
