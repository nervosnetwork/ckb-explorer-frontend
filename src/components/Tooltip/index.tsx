import { Provider, Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.scss'

export interface TooltipProps {
  children: React.ReactNode
  trigger: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentStyle?: React.CSSProperties
  contentClassName?: string
  disabled?: boolean
  isPopover?: boolean
  showArrow?: boolean
  portalContainer?: HTMLElement | null
}
const Tooltip: FC<TooltipProps> = ({
  children,
  trigger,
  placement = 'top',
  open,
  onOpenChange,
  contentStyle,
  contentClassName,
  disabled,
  isPopover = false,
  showArrow = true,
  portalContainer,
}) => {
  if (disabled) {
    return <>{trigger}</>
  }
  return (
    <Provider delayDuration={0}>
      <Root open={open} onOpenChange={onOpenChange}>
        <Trigger asChild className={styles.trigger}>
          {trigger}
        </Trigger>
        <Portal container={portalContainer}>
          <Content
            side={placement}
            style={contentStyle}
            className={classNames(styles.content, contentClassName, { [styles.popover]: isPopover })}
          >
            {showArrow && <Arrow className={classNames(styles.arrow, { [styles.popoverArrow]: isPopover })} />}
            {children}
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}

export default Tooltip
