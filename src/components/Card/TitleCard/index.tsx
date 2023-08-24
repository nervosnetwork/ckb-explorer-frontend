import { TitleCardPanel } from './styled'

export default ({
  title,
  isSingle,
  className,
  rear,
}: {
  title: React.ReactNode
  isSingle?: boolean
  className?: string
  rear?: React.ReactNode
}) => (
  <TitleCardPanel isSingle={isSingle} className={className} hasRear={!!rear}>
    <div className="title__card__content">{title}</div>
    {rear ? <div className="title__card__rear">{rear}</div> : null}
  </TitleCardPanel>
)
