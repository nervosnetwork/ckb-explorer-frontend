import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../http/response/Transaction'
import GreenArrowDown from '../../assets/green_arrow_down.png'
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

  @media (max-width: 320px) {
    > div {
      font-size: 13px;
    }

    .card__value {
      font-size: 12px;
    }
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
        <code className="card__value">{value}</code>
      )}
    </CardItemPanel>
  )
}

const AddressHashItem = (input: InputOutput, address?: string) => {
  if (input.from_cellbase) {
    return <CardLabelItem key={input.id} value="Cellbase" />
  }
  if (input.address_hash) {
    if (address && input.address_hash === address) {
      return (
        <div key={input.id}>
          <CardLabelItem value={`${startEndEllipsis(input.address_hash, 14)}`} />
          <CardLabelItem value={`${shannonToCkb(input.capacity)} CKB`} />
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

const TransactionCard = ({ transaction, address }: { transaction: Transaction; address?: string }) => {
  return (
    <CardPanel>
      <CardLabelItem
        value={`${startEndEllipsis(transaction.transaction_hash, 14)}`}
        to={`/transaction/${transaction.transaction_hash}`}
        highLight
      />
      <div className="sperate__line" />
      {transaction.display_inputs.map((input: InputOutput) => {
        return AddressHashItem(input, address)
      })}
      <div className="green__arrow">
        <img src={GreenArrowDown} alt="arrow" />
      </div>
      {transaction.display_outputs.map((output: InputOutput) => {
        return AddressHashItem(output, address)
      })}
    </CardPanel>
  )
}

export default TransactionCard
