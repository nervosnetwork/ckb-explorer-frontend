import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import classNames from 'classnames'
import { useBlockchainAlerts, useNetworkErrMsgs } from '../../../services/ExplorerService'
import styles from './index.module.scss'

const Sheet = () => {
  const { t } = useTranslation()
  const networkErrMsgs = useNetworkErrMsgs()
  const chainAlerts = useBlockchainAlerts()
  const messages = useMemo<string[]>(() => [...chainAlerts, ...networkErrMsgs], [chainAlerts, networkErrMsgs])

  return messages.length > 0 ? (
    <div className={styles.sheetPanel}>
      {messages.map((context: string, index: number) => {
        const key = index
        return (
          <div className={classNames(styles.sheetPointPanel, messages.length === 1 && styles.isSingle)} key={key}>
            {messages.length > 1 && <span>·</span>}
            <div className={styles.sheetItem}>{t(context)}</div>
          </div>
        )
      })}
    </div>
  ) : null
}

export default Sheet
