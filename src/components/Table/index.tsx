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
`

const TableTitleRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 65px;

  > img {
    width: 23px;
    height: 23px;
  }

  > div {
    color: white;
    font-size: 20px;
    margin-left: 10px;
  }
`

export const TableContentRow = styled.div`
  display: flex;
  width: 1200px;
  &:nth-child(odd) {
    background-color: transparent;
  }
  &:nth-child(even) {
    background-color: white;
  }
  &:hover {
    // background-color: transparent;
  }
`

const TableContentRowItem = styled.div`
  width: 240px;
  height: 65px;
  color: #888888;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TableMinerContentPanel = styled.div`
  height: 65px;
  width: 240px;

  .table__miner__content {
    line-height: 65px;
    color: #4bbc8e;
    text-decoration: none;
  }

  .table__miner__text {
    display: flex;
    align-items: center;
    line-height: 65px;
    justify-content: center;
    font-size: 16px;
  }

  .table__miner__text__disable {
    display: flex;
    align-items: center;
    line-height: 65px;
    justify-content: center;
    font-size: 16px;
    color: #888888;
  }
`

export const TableTitleItem = ({ image, title }: { image: string; title: string }) => {
  return (
    <TableTitleRowItem>
      <img src={image} alt={title} />
      <div>{title}</div>
    </TableTitleRowItem>
  )
}

export const TableContentItem = ({ content, to }: { content: string; to?: any }) => {
  const highLightStyle = {
    color: '#4BBC8E',
    textDecoration: 'none',
  }
  const highLight = to !== undefined
  return (
    <TableContentRowItem>
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

export const TableMinerContentItem = ({ content }: { content: string }) => {
  return (
    <TableMinerContentPanel>
      {content ? (
        <Link className="table__miner__content" to={`/address/${content}`}>
          <code className="table__miner__text">{content && startEndEllipsis(content)}</code>
        </Link>
      ) : (
        <div className="table__miner__text__disable">{i18n.t('common.unabledecode')}</div>
      )}
    </TableMinerContentPanel>
  )
}
