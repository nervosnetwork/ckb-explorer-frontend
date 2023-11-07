import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { SheetPanel, SheetPointPanel, SheetItem } from './styled'
import { useBlockchainAlerts, useNetworkErrMsgs } from '../../services/ExplorerService'

const Sheet = () => {
  const { t } = useTranslation()
  const networkErrMsgs = useNetworkErrMsgs()
  const chainAlerts = useBlockchainAlerts()
  const messages = useMemo<string[]>(() => [...chainAlerts, ...networkErrMsgs], [chainAlerts, networkErrMsgs])

  return messages.length > 0 ? (
    <SheetPanel>
      {messages.map((context: string, index: number) => {
        const key = index
        return (
          <SheetPointPanel key={key} isSingle={messages.length === 1}>
            {messages.length > 1 && <span>·</span>}
            <SheetItem>{t(context)}</SheetItem>
          </SheetPointPanel>
        )
      })}
    </SheetPanel>
  ) : null
}

export default Sheet
