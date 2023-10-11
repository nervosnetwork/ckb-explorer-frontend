import classNames from 'classnames'
import { TitleCardPanel } from './styled'

export default ({
  title,
  isSingle,
  className,
  rear,
  rearClassName,
}: {
  title: React.ReactNode
  isSingle?: boolean
  className?: string
  rear?: React.ReactNode
  rearClassName?: string
}) => (
  <TitleCardPanel isSingle={isSingle} className={className} hasRear={!!rear}>
    <div className="titleCardContent">{title}</div>
    {rear ? <div className={classNames('titleCardRear', rearClassName)}>{rear}</div> : null}
  </TitleCardPanel>
)
