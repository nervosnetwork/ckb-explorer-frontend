import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'

export interface OverviewItemData {
  key?: string
  title: ReactNode
  content: ReactNode
}

const OverviewItem = ({ title, content }: { title?: ReactNode; content?: ReactNode }) => {
  return (
    <OverviewItemPanel>
      <div className="overview_item__title">{title}</div>
      <div className="overview_item__value">{content}</div>
    </OverviewItemPanel>
  )
}

export default ({ items, children }: { items: OverviewItemData[]; children?: ReactNode }) => {
  const leftItems: OverviewItemData[] = []
  const rightItems: OverviewItemData[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      leftItems.push(item)
    } else {
      rightItems.push(item)
    }
  })
  return (
    <OverviewCardPanel>
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map(item => (
            <OverviewItem key={items.indexOf(item)} title={item.title} content={item.content} />
          ))}
        </div>
        <span />
        <div className="overview_content__right_items">
          {rightItems.map(item => (
            <OverviewItem key={items.indexOf(item)} title={item.title} content={item.content} />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
