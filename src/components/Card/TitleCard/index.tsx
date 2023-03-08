import { ReactNode } from 'react'
import { TitleCardPanel } from './styled'

export default ({
  title,
  isSingle,
  className,
  rear,
}: {
  title: string
  isSingle?: boolean
  className?: string
  rear?: ReactNode
}) => (
  <TitleCardPanel isSingle={isSingle} className={className} hasRear={!!rear}>
    <div className="title__card__content">{title}</div>
    {rear ? <div>{rear}</div> : null}
  </TitleCardPanel>
)
