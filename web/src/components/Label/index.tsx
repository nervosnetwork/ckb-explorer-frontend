import React from 'react'
import styled from 'styled-components'

const LabelPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  margin-top: 24px;

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

const SimpleLabel = ({ image, label, value }: { image: string; label: string; value: any }) => {
  return (
    <LabelPanel>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div>{value}</div>
    </LabelPanel>
  )
}

export default SimpleLabel
