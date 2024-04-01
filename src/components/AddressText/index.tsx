import { Tooltip } from 'antd'
import { ComponentProps, FC } from 'react'
import classNames from 'classnames'
import { LinkProps } from 'react-router-dom'
import { Link } from '../Link'
import { useBoolean } from '../../hooks'
import EllipsisMiddle from '../EllipsisMiddle'
import CopyTooltipText from '../Text/CopyTooltipText'
import styles from './styles.module.scss'

const AddressText: FC<{
  children: string
  fontKey?: ComponentProps<typeof EllipsisMiddle>['fontKey']
  className?: string
  containerClass?: string
  disableTooltip?: boolean
  linkProps?: LinkProps
  monospace?: boolean
  useTextWidthForPlaceholderWidth?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}> = ({
  children: address,
  fontKey,
  className,
  containerClass,
  disableTooltip,
  linkProps,
  monospace = true,
  useTextWidthForPlaceholderWidth = true,
  style,
  onClick,
}) => {
  const [isTruncated, truncatedCtl] = useBoolean(false)

  const content = (
    <Tooltip
      trigger={isTruncated && !disableTooltip ? 'hover' : []}
      placement="top"
      title={<CopyTooltipText content={address} />}
    >
      <EllipsisMiddle
        onClick={onClick}
        style={style}
        useTextWidthForPlaceholderWidth={useTextWidthForPlaceholderWidth}
        fontKey={fontKey}
        className={classNames(
          {
            monospace,
          },
          linkProps == null && containerClass,
          className,
        )}
        onTruncateStateChange={truncatedCtl.toggle}
      >
        {address}
      </EllipsisMiddle>
    </Tooltip>
  )

  if (linkProps != null && linkProps.to !== window.location.pathname) {
    const { className, ...props } = linkProps
    return (
      <Link className={classNames(styles.link, containerClass, className)} {...props}>
        {content}
      </Link>
    )
  }

  return content
}

export default AddressText
