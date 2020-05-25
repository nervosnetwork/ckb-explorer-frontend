import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'
import { isMobile, isScreenSmallerThan1200 } from '../../../utils/screen'

export interface OverviewItemData {
  title: ReactNode
  content: ReactNode
  icon?: any
  isAsset?: boolean
}

const handleOverviewItems = (items: OverviewItemData[]) => {
  return {
    leftItems: isMobile() ? items : items.filter((_item: any, index: number) => index % 2 === 0),
    rightItems: isMobile() ? [] : items.filter((_item: any, index: number) => index % 2 !== 0),
  }
}

export const OverviewItem = ({ item, hiddenLine }: { item: OverviewItemData; hiddenLine: boolean }) => {
  return (
    <OverviewItemPanel hiddenLine={hiddenLine} hasIcon={item.icon} isAsset={item.isAsset}>
      <div className="overview_item__title__panel">
        {item.icon && (
          <div className="overview_item__icon">
            <img src={item.icon} alt="item icon" />
          </div>
        )}
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
      <div className="overview__separate" />
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map((item, index) => (
            <OverviewItem key={items.indexOf(item)} item={item} hiddenLine={index === leftItems.length - 1} />
          ))}
        </div>
        {!isScreenSmallerThan1200() && <span />}
        <div className="overview_content__right_items">
          {rightItems.map((item, index) => (
            <OverviewItem key={items.indexOf(item)} item={item} hiddenLine={index === rightItems.length - 1} />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
