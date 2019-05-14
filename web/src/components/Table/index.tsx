import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { startEndEllipsis } from '../../utils/util'

export const TableTitleRow = styled.div`
  background: #3CC68A;
  display: flex;
  height: 65px;
  width: 1200px;
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
  height: 70px;
  width: 240px;
    
  .table__miner__content {
    line-height: 65px;
    color: #4bbc8e;
    text-decoration: none;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
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
      <Link className="table__miner__content" to={`/address/${content}`}>
        <div className="table__miner__text">{startEndEllipsis(content)}</div>
      </Link>
    </TableMinerContentPanel>
  )
}
