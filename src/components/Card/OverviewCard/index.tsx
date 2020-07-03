import React, { ReactNode } from 'react'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'
import { isMobile, isScreenSmallerThan1200 } from '../../../utils/screen'
import HelpIcon from '../../../assets/qa_help.png'
import { Tooltip } from 'antd'

export interface OverviewItemData {
  title: ReactNode
  content: ReactNode
  icon?: any
  isAsset?: boolean
  tooltip?: string
}

const handleOverviewItems = (items: OverviewItemData[]) => {
  return {
    leftItems: isMobile() ? items : items.filter((_item: any, index: number) => index % 2 === 0),
    rightItems: isMobile() ? [] : items.filter((_item: any, index: number) => index % 2 !== 0),
  }
}

export const OverviewItem = ({ item, hideLine }: { item: OverviewItemData; hideLine: boolean }) => {
  return (
    <OverviewItemPanel hideLine={hideLine} hasIcon={item.icon} isAsset={item.isAsset}>
      <div className="overview_item__title__panel">
        {item.icon && (
          <div className="overview_item__icon">
            <img src={item.icon} alt="item icon" />
          </div>
        )}
        <div className="overview_item__title">
          <span>{item.title}</span>
          {item.tooltip && (
            <Tooltip placement="top" title={item.tooltip}>
              <img src={HelpIcon} alt="help icon" />
            </Tooltip>
          )}
        </div>
      </div>
      <div className="overview_item__value">{item.content}</div>
    </OverviewItemPanel>
  )
}

export default ({
  items,
  children,
  titleCard,
  hideShadow,
}: {
  items: OverviewItemData[]
  children?: ReactNode
  titleCard?: ReactNode
  hideShadow?: boolean
}) => {
  const { leftItems, rightItems } = handleOverviewItems(items)
  return (
    <OverviewCardPanel hideShadow={hideShadow}>
      {titleCard}
      <div className="overview__separate" />
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map((item, index) => (
            <OverviewItem key={items.indexOf(item)} item={item} hideLine={index === leftItems.length - 1} />
          ))}
        </div>
        {!isScreenSmallerThan1200() && <span />}
        <div className="overview_content__right_items">
          {rightItems.map((item, index) => (
            <OverviewItem key={items.indexOf(item)} item={item} hideLine={index === rightItems.length - 1} />
          ))}
        </div>
      </OverviewContentPanel>
      {children}
    </OverviewCardPanel>
  )
}
