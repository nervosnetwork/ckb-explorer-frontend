import { ReactNode } from 'react'
import { ItemCardPanel, ItemContentPanel, ItemDetailPanel } from './styled'

export interface ItemCardData {
  title: string
  content: ReactNode
}

export const ItemDetail = ({ item, hideLine }: { item: ItemCardData; hideLine: boolean }) => (
  <ItemDetailPanel hideLine={hideLine}>
    <div className="item__detail__title">{item.title}</div>
    <div className="item__detail__value">{item.content}</div>
  </ItemDetailPanel>
)

export default ({
  items,
  children,
  outputIndex,
}: {
  items: ItemCardData[]
  children?: ReactNode
  outputIndex?: string
}) => (
  <ItemCardPanel id={outputIndex ? `output_${outputIndex}` : ''}>
    <ItemContentPanel>
      {items.map((item, index) => (
        <ItemDetail key={item.title} item={item} hideLine={index === items.length - 1} />
      ))}
    </ItemContentPanel>
    {children}
  </ItemCardPanel>
)
