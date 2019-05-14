import React from 'react'
import styled from 'styled-components'
import { shannonToCkb } from '../../../utils/util'

const LabelItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  margin-bottom: 24px;

  > img {
    width: 20px;
    height: 20px;
  }

  > span {
    font-size: 18px;
    color: rgb(77, 77, 77);
    margin-left: 10px;
    margin-right: 21px;
  }

  > div {
    font-size: 16px;
    color: rgb(136, 136, 136);
  }
`

const CellConsumedLabel = ({
  image,
  label,
  consumed,
}: {
  image: string
  label: string
  consumed: number
}) => {
  return (
    <LabelItemPanel>
      <img src={image} alt="Cell Consumed" />
      <span>{`${label}:`}</span>
      <div>{`${shannonToCkb(consumed)} Byte`}</div>
    </LabelItemPanel>
  )
}

export default CellConsumedLabel
