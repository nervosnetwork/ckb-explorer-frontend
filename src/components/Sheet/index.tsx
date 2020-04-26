import React from 'react'
import { useAppState } from '../../contexts/providers'
import { SheetPanel, SheetPointPanel, SheetItem } from './styled'

const Sheet = () => {
  const { app } = useAppState()
  const messages: string[] = app.appErrors[1].message.concat(app.appErrors[0].message)

  return messages.length > 0 ? (
    <SheetPanel>
      <div>
        {messages.map((context: string, index: number) => {
          const key = index
          return (
            <SheetPointPanel key={key} isSingle={messages.length === 1}>
              {messages.length > 1 && <span>·</span>}
              <SheetItem>{context}</SheetItem>
            </SheetPointPanel>
          )
        })}
      </div>
    </SheetPanel>
  ) : null
}

export default Sheet
