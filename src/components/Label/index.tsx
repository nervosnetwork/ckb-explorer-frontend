import React from 'react'
import styled from 'styled-components'

const LabelPanel = styled.div`
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

  .label__content__full__length {
    color: rgb(136, 136, 136);
  }

  .label__content__limit__length {
    color: rgb(136, 136, 136);
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 700px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;

    > img {
      display: none;
      width: 15px;
      height: 15px;
    }

    > span {
      font-size: 16px;
      color: rgb(77, 77, 77);
      margin-left: 10px;
      margin-right: 10px;
    }

    > div {
      font-size: 15px;
      color: rgb(136, 136, 136);
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 320px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;

    > img {
      display: none;
      width: 15px;
      height: 15px;
    }

    > span {
      font-size: 14px;
      color: rgb(77, 77, 77);
      margin-left: 10px;
      margin-right: 10px;
    }

    > div {
      font-size: 13px;
      color: rgb(136, 136, 136);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

const SimpleLabel = ({
  image,
  label,
  value,
  highLight,
  style,
  lengthNoLimit,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
  style?: any
  lengthNoLimit?: boolean
}) => {
  const highLightStyle = {
    color: '#4BBC8E',
  }
  const normalStyle = {
    color: '#888888',
  }
  const className = lengthNoLimit ? 'label__content__full__length' : 'label__content__limit__length'
  return (
    <LabelPanel style={style}>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div style={highLight ? highLightStyle : normalStyle} className={className}>
        {value}
      </div>
    </LabelPanel>
  )
}

export default SimpleLabel
