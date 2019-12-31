import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import browserHistory from '../../routes/history'
import i18n from '../../utils/i18n'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import CopyTooltipText from '../Tooltip/CopyTooltipText'
import { AppDispatch } from '../../contexts/providers/reducer'
import { isMobile } from '../../utils/screen'

export const TableTitleRow = styled.div`
  background: ${props => props.theme.primary};
  display: flex;
  min-height: 65px;
  border-radius: 6px 6px 0px 0px;
  padding: 0 2%;
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

    @media (max-width: 1000px) {
      font-size: 16px;
    }
  }
`

export const TableContentRow = styled.div`
  position: relative;
  display: flex;
  min-height: 60px;
  background-color: white;
  padding: 20px 2%;
  cursor: pointer;

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: 96%;
    height: 1px;
    left: 2%;
    bottom: 1px;
    background: #d8d8d8;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }

  :hover {
    background: #f8f9fa;
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

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

const TableMinerContentPanel = styled.div`
  width: ${(props: { width: string }) => props.width};
  line-height: 20px;
  text-align: center;
  .table__miner__content {
    color: ${(props: { theme: any }) => props.theme.primary};
    text-decoration: none;
  }

  .table__miner__text {
    width: 100%
    justify-content: center;
    font-size: ${(props: { width: string; fontSize: string }) => props.fontSize};
    font-weight: 500;

    @media(max-width: 700px) {
      font-size: 13px;
    }
  }

  .table__miner__text__disable {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: { width: string; fontSize: string }) => props.fontSize};
    color: #000000;

    @media(max-width: 700px) {
      font-size: 13px;
    }
  }
`

const HighlightLink = styled(Link)`
  color: ${props => props.theme.primary}
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  text-decoration: none;
`

export const TableTitleItem = ({ width, title }: { width: string; title: string }) => {
  return (
    <TableTitleRowItem width={width}>
      <div>{title}</div>
    </TableTitleRowItem>
  )
}

export const TableContentItem = ({
  width,
  content,
  to,
  linkFirst,
}: {
  width: string
  content: string | ReactNode
  to?: any
  linkFirst?: boolean
}) => {
  const highLight = to !== undefined
  return (
    <TableContentRowItem width={width}>
      {highLight ? (
        <HighlightLink
          to={to}
          onClick={event => {
            if (linkFirst) {
              event.stopPropagation()
              browserHistory.push(to)
              event.preventDefault()
            }
          }}
        >
          {content}
        </HighlightLink>
      ) : (
        content
      )}
    </TableContentRowItem>
  )
}

export const TableMinerContentItem = ({
  width,
  content,
  dispatch,
  smallWidth,
  fontSize = '16px',
}: {
  width: string
  content: string
  dispatch: AppDispatch
  smallWidth?: boolean
  fontSize?: string
}) => {
  let addressText = adaptPCEllipsis(content, smallWidth ? 2 : 14, 60)
  if (isMobile()) {
    addressText = adaptMobileEllipsis(content, 11)
  }
  return (
    <TableMinerContentPanel width={width} fontSize={fontSize}>
      {content ? (
        <Link
          className="table__miner__content"
          to={`/address/${content}`}
          onClick={event => {
            event.stopPropagation()
            browserHistory.push(`/address/${content}`)
            event.preventDefault()
          }}
        >
          {addressText.includes('...') ? (
            <Tooltip placement="top" title={<CopyTooltipText content={content} dispatch={dispatch} />}>
              <span className="table__miner__text address">{addressText}</span>
            </Tooltip>
          ) : (
            <span className="table__miner__text address">{addressText}</span>
          )}
        </Link>
      ) : (
        <div className="table__miner__text__disable">{i18n.t('address.unable_decode_address')}</div>
      )}
    </TableMinerContentPanel>
  )
}
