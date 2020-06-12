import React from 'react'
import { TitleCardPanel } from './styled'

export default ({ title, isSingle }: { title: string; isSingle?: boolean }) => {
  return (
    <TitleCardPanel isSingle={isSingle}>
      <div className="title__card__content">{title}</div>
    </TitleCardPanel>
  )
}
