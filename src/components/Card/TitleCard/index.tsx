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
    <div className="titleCardContent">{title}</div>
    {rear ? <div className="titleCardRear">{rear}</div> : null}
  </TitleCardPanel>
)
