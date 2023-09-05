import { isValidElement, ReactNode } from 'react'
import { TooltipProps } from 'antd'
import classNames from 'classnames'
import { OverviewCardPanel, OverviewContentPanel, OverviewItemPanel } from './styled'
import { useIsLGScreen, useIsMobile } from '../../../utils/hook'
import { HelpTip } from '../../HelpTip'

export type OverviewItemData = {
  title: ReactNode
  content: ReactNode
  contentWrapperClass?: string
  filled?: boolean
  icon?: any
  isAsset?: boolean
  tooltip?: TooltipProps['title']
  valueTooltip?: string
} | null

const handleOverviewItems = (items: OverviewItemData[], isMobile: boolean) => ({
  leftItems: isMobile ? items : items.filter((_item: any, index: number) => index % 2 === 0),
  rightItems: isMobile ? [] : items.filter((_item: any, index: number) => index % 2 !== 0),
})

export const OverviewItem = ({ item, hideLine }: { item: OverviewItemData; hideLine: boolean }) =>
  item ? (
    <OverviewItemPanel hideLine={hideLine} hasIcon={item.icon} isAsset={item.isAsset}>
      <div className="overview_item__title__panel">
        {item.icon && (
          <div className="overview_item__icon">
            <img src={item.icon} alt="item icon" />
          </div>
        )}
        <div className="overview_item__title">
          <span>{item.title}</span>
          {item.tooltip && <HelpTip title={item.tooltip} />}
        </div>
      </div>
      <div className={classNames('overview_item__value', { filled: item.filled }, item.contentWrapperClass)}>
        {isValidElement(item.content) ? item.content : <span>{item.content}</span>}
        {item.valueTooltip && <HelpTip title={item.valueTooltip} />}
      </div>
    </OverviewItemPanel>
  ) : null

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
  const isMobile = useIsMobile()
  const isLG = useIsLGScreen()
  /* eslint-disable react/no-array-index-key */
  const { leftItems, rightItems } = handleOverviewItems(items, isMobile)
  return (
    <OverviewCardPanel hideShadow={hideShadow}>
      {titleCard}
      <div className="overview__separate" />
      <OverviewContentPanel length={leftItems.length}>
        <div className="overview_content__left_items">
          {leftItems.map((item, index) =>
            item ? (
              <OverviewItem
                key={`${item.title?.toString()}-${item.content?.toString()}-${index}`}
                item={item}
                hideLine={index === leftItems.length - 1}
              />
            ) : null,
          )}
        </div>
        {!isLG && <span />}
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
