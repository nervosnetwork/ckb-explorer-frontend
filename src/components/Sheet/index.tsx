import { SheetPanel, SheetPointPanel, SheetItem } from './styled'
import { createGlobalState, createGlobalStateSetter, useGlobalState } from '../../utils/state'

const globalNetworkErrMsgs = createGlobalState<string[]>([])
const globalChainAlerts = createGlobalState<string[]>([])

export const setNetworkErrMsgs = createGlobalStateSetter(globalNetworkErrMsgs)
export const setChainAlerts = createGlobalStateSetter(globalChainAlerts)

const Sheet = () => {
  const [networkErrMsgs] = useGlobalState(globalNetworkErrMsgs)
  const [chainAlerts] = useGlobalState(globalChainAlerts)
  const messages: string[] = chainAlerts.concat(networkErrMsgs)

  return messages.length > 0 ? (
    <SheetPanel>
      {messages.map((context: string, index: number) => {
        const key = index
        return (
          <SheetPointPanel key={key} isSingle={messages.length === 1}>
            {messages.length > 1 && <span>·</span>}
            <SheetItem>{context}</SheetItem>
          </SheetPointPanel>
        )
      })}
    </SheetPanel>
  ) : null
}

export default Sheet
