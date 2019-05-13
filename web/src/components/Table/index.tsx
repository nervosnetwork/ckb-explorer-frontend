import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const TableTitleRow = styled.div`
  background: rgb(75, 188, 142);
  display: flex;
  height: 78px;
  width: 1200px;
`

const TableTitleRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 78px;

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
  color: #888888;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TableMinerContentPanel = styled.div`
  height: 78px;
  width: 240px;
    
  .table__miner__content {
    line-height: 78px;
    color: #4bbc8e;
    text-decoration: none;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;

      .table__miner__text {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .table__miner__text__end {
        margin-left: -8px;
        width: 60px;
      }
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
        <div>
          <div className="table__miner__text">{content}</div>
          <div className="table__miner__text__end">{content.substr(content.length-8, 8)}</div>
        </div>
      </Link>
    </TableMinerContentPanel>
  )
}
