import classNames from 'classnames'
import { FC, HTMLAttributes, ReactNode } from 'react'
import styles from './styled.module.scss'

export const TransactionCellPanel: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellPanel} {...props}>
    {children}
  </div>
)

export const TransactionCellContentPanel: FC<
  { children: ReactNode; isCellbase: boolean } & HTMLAttributes<HTMLDivElement>
> = ({ children, isCellbase, ...props }) => (
  <div className={classNames(styles.transactionCellContentPanel, isCellbase && styles.isCellbase)} {...props}>
    {children}
  </div>
)
export const TransactionCellInfoPanel: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellInfoPanel} {...props}>
    {children}
  </div>
)

export const TransactionCellAddressPanel: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellAddressPanel} {...props}>
    {children}
  </div>
)

export const TransactionCellHashPanel: FC<
  { children: ReactNode; highLight: boolean } & HTMLAttributes<HTMLDivElement>
> = ({ children, highLight, ...props }) => (
  <div className={classNames(styles.transactionCellHashPanel, highLight && styles.highLight)} {...props}>
    {children}
  </div>
)

export const TransactionCellDetailPanel: FC<
  { children: ReactNode; isWithdraw: boolean } & HTMLAttributes<HTMLDivElement>
> = ({ children, isWithdraw, ...props }) => (
  <div className={classNames(styles.transactionCellDetailPanel, isWithdraw && styles.isWithdraw)} {...props}>
    {children}
  </div>
)

export const TransactionCellCardSeparate: FC<{ children?: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellCardSeparate} {...props}>
    {children}
  </div>
)

export const TransactionCellDetailModal: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellDetailModal} {...props}>
    {children}
  </div>
)

export const TransactionCellCardPanel: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellCardPanel} {...props}>
    {children}
  </div>
)

export const TransactionCellCardContent: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <div className={styles.transactionCellCardContent} {...props}>
    {children}
  </div>
)

export const TransactionCellMobileItem = ({
  title,
  value = null,
}: {
  title: string | ReactNode
  value?: ReactNode
}) => (
  <TransactionCellCardContent>
    <div className="transactionCellCardTitle">{title}</div>
    <div className="transactionCellCardValue">{value}</div>
  </TransactionCellCardContent>
)
