import { useAppState } from '../../contexts/providers'
import { SheetPanel, SheetPointPanel, SheetItem } from './styled'
import { currentLanguage } from '../../utils/i18n'

const Sheet = () => {
  const {
    app,
    components: { maintenanceAlertVisible },
  } = useAppState()
  const messages: string[] = app.appErrors[1].message.concat(app.appErrors[0].message)

  return messages.length > 0 ? (
    <SheetPanel isNotTop={maintenanceAlertVisible} isEn={currentLanguage() === 'en'}>
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
