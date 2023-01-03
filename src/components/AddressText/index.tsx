import { Tooltip } from 'antd'
import { FC } from 'react'
import classNames from 'classnames'
import { Link, LinkProps } from 'react-router-dom'
import { useBoolean } from '../../utils/hook'
import EllipsisMiddle from '../EllipsisMiddle'
import CopyTooltipText from '../Text/CopyTooltipText'
import styles from './styles.module.scss'

const AddressText: FC<{
  children: string
  className?: string
  containerClass?: string
  disableTooltip?: boolean
  linkProps?: LinkProps
  monospace?: boolean
  useTextWidthForPlaceholderWidth?: boolean
}> = ({
  children: address,
  className,
  containerClass,
  disableTooltip,
  linkProps,
  monospace = true,
  useTextWidthForPlaceholderWidth = true,
}) => {
  const [isTruncated, truncatedCtl] = useBoolean(false)

  const content = (
    <Tooltip
      trigger={isTruncated && !disableTooltip ? 'hover' : []}
      placement="top"
      title={<CopyTooltipText content={address} />}
    >
      <EllipsisMiddle
        useTextWidthForPlaceholderWidth={useTextWidthForPlaceholderWidth}
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

  if (linkProps != null) {
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
