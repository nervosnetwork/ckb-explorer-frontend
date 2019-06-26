import React from 'react'
import styled, { css } from 'styled-components'

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
    font-weight: 450;
  }

  > div {
    color: rgb(136, 136, 136);

    ${(props: { highLight: boolean }) =>
      props.highLight &&
      css`
      color: #4BBC8E;
      font-weight: 450;
      source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    `};
  }

  @media (max-width: 700px) {
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;

    > img {
      display: none;
    }

    > span {
      font-size: 16px;
      margin-right: 10px;
    }

    > div {
      font-size: 15px;
    }
  }

  @media (max-width: 320px) {
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;

    > img {
      display: none;
    }

    > span {
      font-size: 14px;
      margin-right: 10px;
    }

    > div {
      font-size: 13px;
    }
  }
`

const SimpleLabel = ({
  image,
  label,
  value,
  highLight,
  style,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
  style?: any
}) => {
  const highLightFont = !!highLight
  return (
    <LabelPanel style={style} highLight={highLightFont}>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div>{value}</div>
    </LabelPanel>
  )
}

export default SimpleLabel
