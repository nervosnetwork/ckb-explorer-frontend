import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { startEndEllipsis } from '../../utils/string'
import i18n from '../../utils/i18n'

export const TableTitleRow = styled.div`
  background: #3cc68a;
  display: flex;
  height: 65px;
  width: 1200px;
  border-radius: 6px 6px 0px 0px;
  padding-right: 12px;
`

const TableTitleRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${({ width }: { width: string }) => width};
  height: 65px;

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
  width: 1200px;
  height: 60px;
  background-color: white;
  padding-right: 12px;

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: 95%;
    height: 1px;
    left: 2.5%;
    bottom: 1px;
    background: #d8d8d8;
    @media (-webkit-min-device-pixel-ratio: 2) {
      transform: scaleY(0.5);
    }
    @media (-webkit-min-device-pixel-ratio: 3) {
      transform: scaleY(0.33);
    }
  }
`

const TableContentRowItem = styled.div`
  width: ${({ width }: { width: string }) => width};
  height: 60px;
  color: #888888;
  font-weight: 450;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
`

const TableMinerContentPanel = styled.div`
  height: 60px;
  width: ${({ width }: { width: string }) => width};

  .table__miner__content {
    line-height: 60px;
    color: #4bbc8e;
    text-decoration: none;
  }

  .table__miner__text {
    display: flex;
    align-items: center;
    line-height: 60px;
    justify-content: center;
    font-size: 16px;
    font-weight: 450;
  }

  .table__miner__text__disable {
    display: flex;
    align-items: center;
    line-height: 60px;
    justify-content: center;
    font-size: 16px;
    color: #888888;
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
          <code className="table__miner__text">{content && startEndEllipsis(content, 20)}</code>
        </Link>
      ) : (
        <div className="table__miner__text__disable">{i18n.t('address.unable_decode_address')}</div>
      )}
    </TableMinerContentPanel>
  )
}
