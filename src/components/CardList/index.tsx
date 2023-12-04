import { ComponentProps, ReactNode } from 'react'
import classNames from 'classnames'
import { Card, CardCellsLayout, CardProps } from '../Card'
import styles from './index.module.scss'

interface CardListProps<T> extends ComponentProps<'div'> {
  dataSource: T[]
  cardContentRender: (data: T) => ReactNode
  getDataKey?: (data: T, index: number) => string | number
  cardProps?: CardProps
}

export function CardList<T>({ dataSource, cardContentRender, getDataKey, cardProps, ...elProps }: CardListProps<T>) {
  return (
    <div {...elProps} className={classNames(styles.cardList, elProps.className)}>
      {dataSource.map((data, index) => (
        <Card key={getDataKey?.(data, index) ?? index} {...cardProps}>
          {cardContentRender(data)}
        </Card>
      ))}
    </div>
  )
}

export interface CardCellFactory<T> {
  title: ReactNode | ((data: T, index: number) => ReactNode)
  content: ReactNode | ((data: T, index: number) => ReactNode)
}

interface CardListWithCellsListProps<T> extends Omit<CardListProps<T>, 'cardContentRender'> {
  cells: CardCellFactory<T>[]
}

export function CardListWithCellsList<T>({ cells, ...props }: CardListWithCellsListProps<T>) {
  return (
    <CardList
      {...props}
      cardContentRender={data => (
        <CardCellsLayout
          type="list"
          cells={cells.map(({ title, content }, i) => ({
            title: typeof title === 'function' ? title(data, i) : title,
            content: typeof content === 'function' ? content(data, i) : content,
          }))}
        />
      )}
    />
  )
}
