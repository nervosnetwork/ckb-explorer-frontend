import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'
import { isMobile, isScreenSmallerThan1200 } from '../../../utils/screen'
import { isValidReactNode } from '../../../utils/util'

export interface OverviewItemData {
  title: ReactNode
  content: ReactNode
  icon?: any
  isAsset?: boolean
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

export const OverviewItem = ({ item, hiddenLine }: { item: OverviewItemData; hiddenLine: boolean }) => {
  return (
    <OverviewItemPanel hiddenLine={hiddenLine} hasIcon={item.icon} isAsset={item.isAsset}>
      <div className="overview_item__title__panel">
        {item.icon && <img className="overview_item__icon" src={item.icon} alt="item icon" />}
        <div className="overview_item__title">{item.title}</div>
      </div>
      <div className="overview_item__value">{item.content}</div>
    </OverviewItemPanel>
  )
}

export default ({
  items,
  children,
  outputIndex,
  titleCard,
  hideShadow,
}: {
  items: OverviewItemData[]
  children?: ReactNode
  outputIndex?: string
  titleCard?: ReactNode
  hideShadow?: boolean
}) => {
  const { leftItems, rightItems } = handleOverviewItems(items)
  return (
    <OverviewCardPanel id={outputIndex ? `output_${outputIndex}` : ''} hideShadow={hideShadow}>
      {titleCard}
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map((item, index) => (
            <OverviewItem
              key={items.indexOf(item)}
              item={item}
              hiddenLine={!isValidReactNode(children) && index === leftItems.length - 1}
            />
          ))}
        </div>
        {!isScreenSmallerThan1200() && <span />}
        <div className="overview_content__right_items">
          {rightItems.map((item, index) => (
            <OverviewItem
              key={items.indexOf(item)}
              item={item}
              hiddenLine={!isValidReactNode(children) && index === rightItems.length - 1}
            />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
