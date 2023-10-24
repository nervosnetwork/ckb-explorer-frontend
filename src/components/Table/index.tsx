import { memo, ReactNode } from 'react'
import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { TableTitleRowItem, TableContentRowItem, HighlightLink, TableMinerContentPanel } from './styled'
import AddressText from '../AddressText'

export const TableTitleItem = ({ width, title }: { width: string; title: string }) => (
  <TableTitleRowItem width={width}>
    <div>{title}</div>
  </TableTitleRowItem>
)

export const TableContentItem = ({
  width,
  content,
  to,
}: {
  width: string
  content: string | ReactNode
  to?: string
}) => {
  const highLight = to !== undefined
  return (
    <TableContentRowItem width={width}>
      {highLight ? <HighlightLink to={to}>{content}</HighlightLink> : content}
    </TableContentRowItem>
  )
}

export const TableMinerContentItem = memo(
  ({
    width = 'auto',
    content,
    textCenter,
    fontSize = '16px',
  }: {
    width?: string
    content: string
    textCenter?: boolean
    fontSize?: string
  }) => {
    const { t } = useTranslation()
    return (
      <TableMinerContentPanel width={width} fontSize={fontSize}>
        {content ? (
          <Row justify={textCenter ? 'center' : 'start'}>
            <Col span={20} xl={16}>
              <AddressText
                className="tableMinerText"
                linkProps={{
                  className: 'tableMinerContent',
                  to: `/address/${content}`,
                }}
              >
                {content}
              </AddressText>
            </Col>
          </Row>
        ) : (
          <div className="tableMinerTextDisable">{t('address.unable_decode_address')}</div>
        )}
      </TableMinerContentPanel>
    )
  },
)
