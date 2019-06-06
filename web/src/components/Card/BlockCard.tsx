import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Block } from '../../http/response/Block'
import { startEndEllipsis } from '../../utils/string'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'

const CardPanel = styled.div`
  width: 88%;
  height: 180px;
  background-color: white;
  padding: 10px 20px 20px 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;
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

const CardItem = ({
  name,
  value,
  to,
  highLight = false,
}: {
  name: string
  value: string
  to: string
  highLight?: boolean
}) => {
  return (
    <CardItemPanel highLight={highLight}>
      <div>{name}</div>
      <Link to={to}>
        <div className="card__value">{value}</div>
      </Link>
    </CardItemPanel>
  )
}

const BlockCard = ({ block }: { block: Block }) => {
  return (
    <CardPanel>
      <CardItem name="Height :" value={`${block.number}`} to={`${block.number}`} highLight />
      <CardItem name="Transactions :" value={`${block.transactions_count}`} to={`${block.number}`} />
      <CardItem name="Block Reward (CKB) :" value={`${shannonToCkb(block.reward)}`} to={`${block.reward}`} />
      <CardItem name="Miner :" value={startEndEllipsis(block.miner_hash, 12)} to={`${block.number}`} highLight />
      <CardItem name="Time :" value={parseSimpleDate(block.timestamp)} to={`${block.number}`} />
    </CardPanel>
  )
}

export default BlockCard
