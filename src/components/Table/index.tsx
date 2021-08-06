import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import i18n from '../../utils/i18n'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import { isMobile } from '../../utils/screen'
import { TableTitleRowItem, TableContentRowItem, HighlightLink, TableMinerContentPanel } from './styled'
import CopyTooltipText from '../Text/CopyTooltipText'

export const TableTitleItem = ({ width, title }: { width: string; title: string }) => (
  <TableTitleRowItem width={width}>
    <div>{title}</div>
  </TableTitleRowItem>
)

export const TableContentItem = ({ width, content, to }: { width: string; content: string | ReactNode; to?: any }) => {
  const highLight = to !== undefined
  return (
    <TableContentRowItem width={width}>
      {highLight ? <HighlightLink to={to}>{content}</HighlightLink> : content}
    </TableContentRowItem>
  )
}

export const TableMinerContentItem = ({
  width,
  content,
  smallWidth,
  fontSize = '16px',
}: {
  width: string
  content: string
  smallWidth?: boolean
  fontSize?: string
}) => {
  let addressText = adaptPCEllipsis(content, smallWidth ? 2 : 14, 60)
  if (window.innerWidth <= 1320) {
    addressText = adaptPCEllipsis(content, smallWidth ? 2 : 10, 60)
  }
  if (isMobile()) {
    addressText = adaptMobileEllipsis(content, 11)
  }
  return (
    <TableMinerContentPanel width={width} fontSize={fontSize}>
      {content ? (
        <Link className="table__miner__content" to={`/address/${content}`}>
          {addressText.includes('...') ? (
            <Tooltip placement="top" title={<CopyTooltipText content={content} />}>
              <span className="table__miner__text monospace">{addressText}</span>
            </Tooltip>
          ) : (
            <span className="table__miner__text monospace">{addressText}</span>
          )}
        </Link>
      ) : (
        <div className="table__miner__text__disable">{i18n.t('address.unable_decode_address')}</div>
      )}
    </TableMinerContentPanel>
  )
}
