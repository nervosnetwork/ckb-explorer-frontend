import classNames from 'classnames'
import { Key, ReactElement, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styles from './index.module.scss'

export interface Column<T> {
  title: ReactElement
  key?: string
  width?: string | number
  getLinkProps?: (data: T) => LinkProps
  render?: (data: T) => ReactNode
  className?: string
  headerClassName?: string
}

export function Table<T>({
  columns,
  dataSource,
  getRowKey,
  className,
}: {
  columns: Column<T>[]
  dataSource: T[]
  getRowKey?: (data: T) => Key
  className?: string
}): ReactElement {
  return (
    <div className={classNames(styles.table, className)}>
      <div className={styles.headerRow}>
        {columns.map(col => (
          <div
            key={col.key ?? col.title.key}
            className={classNames(styles.cell, col.headerClassName)}
            style={{
              width: col.width,
            }}
          >
            {col.title}
          </div>
        ))}
      </div>

      {dataSource.map((row, idx) => (
        <div key={getRowKey?.(row) ?? idx} className={styles.row}>
          {columns.map(col => (
            <div
              key={col.key ?? col.title.key}
              className={classNames(styles.cell, col.className)}
              style={{
                width: col.width,
              }}
            >
              {(() => {
                const content = col.render ? col.render(row) : row
                if (!col.getLinkProps) return content

                const { className, ...rest } = col.getLinkProps(row)
                return (
                  <Link className={classNames(styles.link, className)} {...rest}>
                    {content}
                  </Link>
                )
              })()}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
