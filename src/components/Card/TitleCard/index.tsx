import React from 'react'
import { TitleCardPanel } from './styled'

export default ({ title }: { title: string }) => {
  return (
    <TitleCardPanel>
      <div className="title__card__content">{title}</div>
      <div className="title__card__separate" />
    </TitleCardPanel>
  )
}
