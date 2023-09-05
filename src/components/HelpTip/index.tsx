import { ComponentProps, FC, RefObject } from 'react'
import { Tooltip, TooltipProps } from 'antd'
import classNames from 'classnames'
import HelpIcon from '../../assets/qa_help.png'
import styles from './index.module.scss'
import { useIsMobile } from '../../utils/hook'

export const HelpTip: FC<
  TooltipProps & {
    iconProps?: ComponentProps<'img'>
    // Setting a container ref can avoid scrolling together with deeper scrolling containers.
    containerRef?: RefObject<HTMLDivElement>
  }
> = ({ iconProps, containerRef, ...props }) => {
  const isMobile = useIsMobile()

  const finalProps: TooltipProps = {
    placement: isMobile ? 'topLeft' : 'top',
    getPopupContainer: () => containerRef?.current ?? document.body,
    arrowPointAtCenter: true,
    ...props,
  }

  return (
    <Tooltip {...finalProps} overlayClassName={classNames(styles.tooltip, finalProps.className)}>
      <img src={HelpIcon} alt="help icon" {...iconProps} className={classNames(styles.icon, iconProps?.className)} />
    </Tooltip>
  )
}
