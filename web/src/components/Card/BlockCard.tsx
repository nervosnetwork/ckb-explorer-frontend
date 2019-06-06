import React from 'react'
import styled from 'styled-components'

const CardPanel = styled.div`
  width: 335px;
  height: 180px;
  background-color: white;
  padding: 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  flex-direction: column;
`

const CardItemPanel = styled.div`
  display: flex;

  :nth-child(1) {
    color: black;
    font-size: 14px;
  }

  :nth-child(2) {
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-size: 14px;
  }
`

const CardItem = ({ name, value, highLight = false }: { name: string; value: string; highLight?: boolean }) => {
  return (
    <CardItemPanel highLight={highLight}>
      <div>{name}</div>
      <div>{value}</div>
    </CardItemPanel>
  )
}

const BlockCard = ({
  height,
  transactions,
  blockReward,
  miner,
  time,
}: {
  height: string
  transactions: string
  blockReward: string
  miner: string
  time: string
}) => {
  return (
    <CardPanel>
      <CardItem name={height} value={height} highLight />
      <CardItem name={transactions} value={transactions} />
      <CardItem name={blockReward} value={blockReward} />
      <CardItem name={miner} value={miner} />
      <CardItem name={time} value={time} />
    </CardPanel>
  )
}

export default BlockCard
