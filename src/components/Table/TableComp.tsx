import { FC, HTMLAttributes, ReactNode } from 'react'
import styles from './styled.module.scss'

export const TableTitleRow: FC<
  {
    children: ReactNode
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  return (
    <div className={styles.tableTitleRow} {...props}>
      {children}
    </div>
  )
}

export const TableTitleRowItem: FC<
  {
    children: ReactNode
    width?: string
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, width, ...props }) => {
  return (
    <div className={styles.tableTitleRowItem} {...props} style={{ width }}>
      {children}
    </div>
  )
}

export const TableContentRow: FC<
  {
    children: ReactNode
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  return (
    <div className={styles.tableContentRow} {...props}>
      {children}
    </div>
  )
}

export const TableContentRowItem: FC<
  {
    children: ReactNode
    width?: string
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, width, ...props }) => {
  return (
    <div className={styles.tableContentRowItem} {...props} style={{ width }}>
      {children}
    </div>
  )
}

export const TableMinerContentPanel: FC<
  {
    children: ReactNode
    width?: string
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, width, ...props }) => {
  return (
    <div className={styles.tableMinerContentPanel} {...props} style={{ width }}>
      {children}
    </div>
  )
}
