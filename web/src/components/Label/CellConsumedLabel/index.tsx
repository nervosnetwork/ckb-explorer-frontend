import React from 'react'
import styled from 'styled-components'

const LabelItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  margin-bottom: 24px;

  > img {
    width: 28px;
    height: 28px;
  }

  > span {
    font-size: 18px;
    color: rgb(77, 77, 77);
    margin-left: 10px;
    margin-right: 21px;
  }

  > div {
    font-size: 16px;
    color: rgb(75, 188, 142);
  }
`
const CellConsumedBarDiv = styled.div`
  height: 20px;
  width: 160px;
  border-radius: 50px;
  border: 1px solid rgb(75, 188, 142);
  margin-right: 10px;

  > div {
    width: ${(props: { percent: string }) => props.percent}%;
    margin-right: 21px;
    background: rgb(75, 188, 142);
    height: 100%;
    border-radius: inherit;
  }
`

const CellConsumedBar = ({ percent }: { percent: number }) => {
  return (
    <CellConsumedBarDiv percent={`${percent}`}>
      <div />
    </CellConsumedBarDiv>
  )
}

const CellConsumedLabel = ({
  image,
  label,
  consumed,
  balance,
}: {
  image: string
  label: string
  consumed: number
  balance: number
}) => {
  return (
    <LabelItemPanel>
      <img src={image} alt="Cell Consumed" />
      <span>{label}</span>
      <CellConsumedBar percent={(consumed * 100) / balance} />
      <div>{`${consumed}B / ${(consumed * 100) / balance}%`}</div>
    </LabelItemPanel>
  )
}

export default CellConsumedLabel
