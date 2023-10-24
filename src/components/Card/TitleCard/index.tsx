import classNames from 'classnames'
import { ReactNode } from 'react'
import { TitleCardPanel } from './styled'

export default ({
  title,
  isSingle,
  className,
  rear,
  rearClassName,
}: {
  title: ReactNode
  isSingle?: boolean
  className?: string
  rear?: ReactNode
  rearClassName?: string
}) => (
  <TitleCardPanel isSingle={isSingle} className={className} hasRear={!!rear}>
    <div className="titleCardContent">{title}</div>
    {rear ? <div className={classNames('titleCardRear', rearClassName)}>{rear}</div> : null}
  </TitleCardPanel>
)
