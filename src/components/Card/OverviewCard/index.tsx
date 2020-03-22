import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'
import { isMobile, isScreenSmallerThan1200 } from '../../../utils/screen'
import { isValidReactNode } from '../../../utils/util'

export interface OverviewItemData {
  title: ReactNode
  content: ReactNode
}

const handleOverviewItems = (items: OverviewItemData[]) => {
  if (isMobile()) {
    return {
      leftItems: items,
      rightItems: [],
    }
  }
  const leftItems: OverviewItemData[] = []
  const rightItems: OverviewItemData[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      leftItems.push(item)
    } else {
      rightItems.push(item)
    }
  })
  return {
    leftItems,
    rightItems,
  }
}

const OverviewItem = ({
  title,
  content,
  hiddenLine,
}: {
  title?: ReactNode
  content?: ReactNode
  hiddenLine: boolean
}) => {
  return (
    <OverviewItemPanel hiddenLine={hiddenLine}>
      <div className="overview_item__title">{title}</div>
      <div className="overview_item__value">{content}</div>
    </OverviewItemPanel>
  )
}

export default ({
  items,
  children,
  outputIndex,
}: {
  items: OverviewItemData[]
  children?: ReactNode
  outputIndex?: string
}) => {
  const { leftItems, rightItems } = handleOverviewItems(items)
  return (
    <OverviewCardPanel id={outputIndex ? `output_${outputIndex}` : ''}>
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map((item, index) => (
            <OverviewItem
              key={items.indexOf(item)}
              title={item.title}
              content={item.content}
              hiddenLine={!isValidReactNode(children) && index === leftItems.length - 1}
            />
          ))}
        </div>
        {!isScreenSmallerThan1200() && <span />}
        <div className="overview_content__right_items">
          {rightItems.map((item, index) => (
            <OverviewItem
              key={items.indexOf(item)}
              title={item.title}
              content={item.content}
              hiddenLine={!isValidReactNode(children) && index === rightItems.length - 1}
            />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
