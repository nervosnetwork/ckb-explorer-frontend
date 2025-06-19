import { ComponentProps, FC } from 'react'
import classNames from 'classnames'
import HelpIcon from '../../assets/qa_help.png'
import styles from './index.module.scss'
import Tooltip, { TooltipProps } from '../Tooltip'

export const HelpTip: FC<
  Omit<TooltipProps, 'trigger'> & {
    iconProps?: ComponentProps<'img'>
    trigger?: React.ReactNode
  }
> = ({ iconProps, ...props }) => {
  const finalProps: TooltipProps = {
    placement: 'top',
    ...props,
    trigger: props.trigger ?? (
      <img src={HelpIcon} alt="help icon" {...iconProps} className={classNames(styles.icon, iconProps?.className)} />
    ),
  }

  return <Tooltip {...finalProps} contentClassName={classNames(styles.tooltip, finalProps.contentClassName)} />
}
