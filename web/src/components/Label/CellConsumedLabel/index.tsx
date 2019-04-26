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
  let percent = 0
  if (balance !== 0) {
    percent = (consumed * 100) / balance
    percent = percent > 100 ? 100 : percent
  }
  return (
    <LabelItemPanel>
      <img src={image} alt="Cell Consumed" />
      <span>{`${label}:`}</span>
      <div>{`${consumed}B / ${percent}%`}</div>
    </LabelItemPanel>
  )
}

export default CellConsumedLabel
