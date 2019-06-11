import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Transaction, InputOutput } from '../../http/response/Transaction'
import GreenArrowDown from '../../asserts/green_arrow_down.png'

const CardPanel = styled.div`
  width: 88%;
  height: 290px;
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
          <div className="card__value">{value}</div>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
    </CardItemPanel>
  )
}

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  return (
    <CardPanel>
      <CardLabelItem
        value={`${transaction.transaction_hash}`}
        to={`/transaction/${transaction.transaction_hash}`}
        highLight
      />
      <div className="sperate__line" />
      {transaction.display_inputs.map((input: InputOutput) => {
        return (
          <div key={input.id}>
            <CardLabelItem value={`${input.address_hash}`} to={`/address/${input.address_hash}`} highLight />
            <CardLabelItem value={`${input.capacity}`} />
          </div>
        )
      })}
      <img className="green__arrow" src={GreenArrowDown} alt="arrow" />
      {transaction.display_outputs.map((output: InputOutput) => {
        return (
          <div key={output.id}>
            <CardLabelItem value={`${output.address_hash}`} to={`/address/${output.address_hash}`} highLight />
            <CardLabelItem value={`${output.capacity}`} />
          </div>
        )
      })}
    </CardPanel>
  )
}

export default TransactionCard
