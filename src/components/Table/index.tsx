import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import i18n from '../../utils/i18n'
import { adaptPCEllipsis } from '../../utils/string'

export const TableTitleRow = styled.div`
  background: #3cc68a;
  display: flex;
  min-height: 65px;
  border-radius: 6px 6px 0px 0px;
  padding-right: 12px;
`

const TableTitleRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${({ width }: { width: string }) => width};
  min-height: 65px;

  > div {
    color: white;
    font-size: 20px;
    font-weight: 450;
    text-align: center;
    margin-left: 10px;
  }
`

export const TableContentRow = styled.div`
  position: relative;
  display: flex;
  min-height: 60px;
  background-color: white;
  padding-right: 12px;
  padding-top: 20px;
  padding-bottom: 20px;

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: 95%;
    height: 1px;
    left: 2.5%;
    bottom: 1px;
    background: #d8d8d8;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

const TableContentRowItem = styled.div`
  width: ${({ width }: { width: string }) => width};
  color: #000000;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-overflow: ellipsis;
  font-size: 16px;
`

const TableMinerContentPanel = styled.div`
  width: ${({ width }: { width: string }) => width};
  line-height: 20px;
  text-align: center;
  .table__miner__content {
    color: #4bbc8e;
    text-decoration: none;
  }

  .table__miner__text {
    width: 100%
    justify-content: center;
    font-size: 16px;
    font-weight: 450;
  }

  .table__miner__text__disable {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #000000;
  }
`

export const TableTitleItem = ({ width, title }: { width: string; title: string }) => {
  return (
    <TableTitleRowItem width={width}>
      <div>{title}</div>
    </TableTitleRowItem>
  )
}

export const TableContentItem = ({ width, content, to }: { width: string; content: string; to?: any }) => {
  const highLightStyle = {
    color: '#4BBC8E',
    textDecoration: 'none',
  }
  const highLight = to !== undefined
  return (
    <TableContentRowItem width={width}>
      {highLight ? (
        <Link style={highLightStyle} to={to}>
          {content}
        </Link>
      ) : (
        content
      )}
    </TableContentRowItem>
  )
}

export const TableMinerContentItem = ({ width, content }: { width: string; content: string }) => {
  return (
    <TableMinerContentPanel width={width}>
      {content ? (
        <Link className="table__miner__content" to={`/address/${content}`}>
          <code className="table__miner__text">{adaptPCEllipsis(content, 10, 50)}</code>
        </Link>
      ) : (
        <div className="table__miner__text__disable">{i18n.t('address.unable_decode_address')}</div>
      )}
    </TableMinerContentPanel>
  )
}
