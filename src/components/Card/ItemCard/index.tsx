import { ReactElement, ReactNode } from 'react'
import { ItemCardPanel, ItemContentPanel, ItemDetailPanel } from './styled'

export interface ItemCardData<T> {
  title: string
  render: (data: T, index: number) => ReactNode
}

export function ItemCard<T>({
  items,
  data,
  children,
  className,
}: {
  items: ItemCardData<T>[]
  data: T
  children?: ReactNode
  className?: string
}): ReactElement {
  return (
    <ItemCardPanel className={className}>
      <ItemContentPanel>
        {items.map((item, index) => (
          <ItemDetailPanel key={item.title} hideLine={index === items.length - 1}>
            <div className="item__detail__title">{item.title}</div>
            <div className="item__detail__value">{item.render(data, index)}</div>
          </ItemDetailPanel>
        ))}
      </ItemContentPanel>
      {children}
    </ItemCardPanel>
  )
}

export function ItemCardGroup<T>({
  items,
  dataSource,
  getDataKey,
  className,
  cardClassName,
}: {
  items: ItemCardData<T>[]
  dataSource: T[]
  getDataKey: (data: T, index: number) => string | number
  className?: string
  cardClassName?: string
}): ReactElement {
  return (
    <div className={className}>
      {dataSource.map((data, index) => (
        <ItemCard key={getDataKey(data, index)} className={cardClassName} items={items} data={data} />
      ))}
    </div>
  )
}
