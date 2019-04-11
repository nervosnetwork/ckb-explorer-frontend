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

  > div {
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto;

    .table__miner__content {
      line-height: 78px;
      color: #4bbc8e;
      text-decoration: none;
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
      <div>
        <Link className="table__miner__content" to={`/address/${content}`}>
          {content}
        </Link>
      </div>
    </TableMinerContentPanel>
  )
}
