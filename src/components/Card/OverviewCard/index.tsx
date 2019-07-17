import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel, OverviewItemShortPanel } from './styled'

export interface OverviewItemData {
  title: string
  content: ReactNode
}

export const OverviewItem = ({ title, content }: { title?: string; content?: ReactNode }) => {
  return (
    <OverviewItemPanel>
      {title && <div className="overview_item__title">{title}</div>}
      {content && <div className="overview_item__value">{content}</div>}
    </OverviewItemPanel>
  )
}

const OverviewShortItem = ({ title, content }: { title?: string; content?: ReactNode }) => {
  return (
    <OverviewItemShortPanel>
      <div className="overview_item__title">{title}</div>
      <div className="overview_item__value">{content}</div>
    </OverviewItemShortPanel>
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
            <OverviewShortItem key={item.title} title={item.title} content={item.content} />
          ))}
        </div>
        <span />
        <div className="overview_content__right_items">
          {rightItems.map(item => (
            <OverviewShortItem key={item.title} title={item.title} content={item.content} />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
