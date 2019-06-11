import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../http/response/Transaction'
import GreenArrowDown from '../../asserts/green_arrow_down.png'
import { startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'

const CardPanel = styled.div`
  width: 88%;
  background-color: white;
  padding: 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;

  .sperate__line {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
  }

  .green__arrow {
    text-align: center;
    > img {
      width: 20px;
      height: 20px;
    }
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
    font-size: 14px;
  }
`

const CardLabelItem = ({ value, to, highLight = false }: { value: string; to?: string; highLight?: boolean }) => {
  return (
    <CardItemPanel highLight={highLight}>
      {to ? (
        <Link to={to}>
          <code className="card__value">{value}</code>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
    </CardItemPanel>
  )
}

const AddressHashItem = (input: InputOutput) => {
  if (input.from_cellbase) {
    return <CardLabelItem value="Cellbase" />
  }
  if (input.address_hash) {
    return (
      <div key={input.id}>
        <CardLabelItem
          value={`${startEndEllipsis(input.address_hash, 16)}`}
          to={`/address/${input.address_hash}`}
          highLight
        />
        <CardLabelItem value={`${shannonToCkb(input.capacity)} CKB`} />
      </div>
    )
  }
  return (
    <div key={input.id}>
      <CardLabelItem value="Unable to decode address" />
      <CardLabelItem value={`${shannonToCkb(input.capacity)} CKB`} />
    </div>
  )
}

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  return (
    <CardPanel>
      <CardLabelItem
        value={`${startEndEllipsis(transaction.transaction_hash, 16)}`}
        to={`/transaction/${transaction.transaction_hash}`}
        highLight
      />
      <div className="sperate__line" />
      {transaction.display_inputs.map((input: InputOutput) => {
        return AddressHashItem(input)
      })}
      <div className="green__arrow">
        <img src={GreenArrowDown} alt="arrow" />
      </div>
      {transaction.display_outputs.map((output: InputOutput) => {
        return AddressHashItem(output)
      })}
    </CardPanel>
  )
}

export default TransactionCard
