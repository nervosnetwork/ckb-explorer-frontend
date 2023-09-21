import { useAppState } from '../../contexts/providers'
import { SheetPanel, SheetPointPanel, SheetItem } from './styled'
import { currentLanguage } from '../../utils/i18n'
import { createGlobalState, createGlobalStateSetter, useGlobalState } from '../../utils/state'

const globalNetworkErrMsgs = createGlobalState<string[]>([])
const globalChainAlerts = createGlobalState<string[]>([])

export const setNetworkErrMsgs = createGlobalStateSetter(globalNetworkErrMsgs)
export const setChainAlerts = createGlobalStateSetter(globalChainAlerts)

const Sheet = () => {
  const {
    components: { maintenanceAlertVisible },
  } = useAppState()
  const [networkErrMsgs] = useGlobalState(globalNetworkErrMsgs)
  const [chainAlerts] = useGlobalState(globalChainAlerts)
  const messages: string[] = chainAlerts.concat(networkErrMsgs)

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
