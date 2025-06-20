import { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TableTitleRowItem, TableContentRowItem, TableMinerContentPanel } from './TableComp'
import AddressText from '../AddressText'
import { useIsMobile } from '../../hooks'
import { Link } from '../Link'
import styles from './styled.module.scss'

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
      {highLight ? (
        <Link to={to} className={styles.highlightLink}>
          {content}
        </Link>
      ) : (
        content
      )}
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
    const isMobile = useIsMobile()
    const { t } = useTranslation()
    return (
      <TableMinerContentPanel width={width}>
        {content ? (
          <div style={{ display: 'flex', justifyContent: textCenter ? 'center' : 'start', overflow: 'hidden' }}>
            <div style={{ flexBasis: `0 0 100%`, overflow: 'hidden' }}>
              <AddressText
                className="tableMinerText"
                linkProps={{
                  className: 'tableMinerContent',
                  to: `/address/${content}`,
                }}
                style={{
                  fontSize: isMobile ? '13px' : fontSize,
                }}
              >
                {content}
              </AddressText>
            </div>
          </div>
        ) : (
          <div className="tableMinerTextDisable" style={{ fontSize: isMobile ? '13px' : fontSize }}>
            {t('address.unable_decode_address')}
          </div>
        )}
      </TableMinerContentPanel>
    )
  },
)
