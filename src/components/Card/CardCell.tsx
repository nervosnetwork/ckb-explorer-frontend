import { ComponentProps, FC, ReactNode } from 'react'
import { TooltipProps } from 'antd'
import classNames from 'classnames'
import styles from './CardCell.module.scss'
import { HelpTip } from '../HelpTip'

export interface CardCellProps extends Omit<ComponentProps<'div'>, 'title' | 'content'> {
  icon?: ReactNode
  title: ReactNode
  tooltip?: TooltipProps['title']
  content: ReactNode
  contentWrapperClass?: string
  contentTooltip?: TooltipProps['title']
}

export const CardCell: FC<CardCellProps> = ({
  icon,
  title,
  tooltip,
  content,
  contentWrapperClass,
  contentTooltip,
  ...divProps
}) => {
  return (
    <div {...divProps} className={classNames(styles.cardCell, divProps.className)}>
      <div className={styles.left}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.title}>{title}</div>
        {tooltip && <HelpTip title={tooltip} />}
      </div>

      <div className={classNames(styles.right, contentWrapperClass)}>
        {content}
        {contentTooltip && <HelpTip title={contentTooltip} />}
      </div>
    </div>
  )
}
