import { FC, PropsWithChildren } from 'react'
import { useIsMobile } from '../../../hooks'
import styles from './styles.module.scss'

export const TransactionCellList: FC<
  PropsWithChildren<{
    title: React.ReactNode
    extra?: React.ReactNode
  }>
> = ({ title, extra, children }) => {
  const isMobile = useIsMobile()
  return (
    <div className={styles.transactionCellListPanel}>
      <div className={styles.transactionCellListTitlePanel}>
        <div className="transactionCellListTitles">
          {title}
          {!isMobile ? extra : null}
        </div>
      </div>
      {children}
    </div>
  )
}
