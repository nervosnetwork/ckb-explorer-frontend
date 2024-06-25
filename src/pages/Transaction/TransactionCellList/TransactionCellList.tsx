import { FC, PropsWithChildren } from 'react'
import { TransactionCellListPanel, TransactionCellListTitlePanel } from './styled'
import { useIsMobile } from '../../../hooks'

export const TransactionCellList: FC<
  PropsWithChildren<{
    title: React.ReactNode
    extra?: React.ReactNode
  }>
> = ({ title, extra, children }) => {
  const isMobile = useIsMobile()
  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transactionCellListTitles">
          {title}
          {!isMobile ? extra : null}
        </div>
      </TransactionCellListTitlePanel>
      {children}
    </TransactionCellListPanel>
  )
}
