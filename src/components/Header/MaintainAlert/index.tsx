import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trans } from 'react-i18next'
import config from '../../../config'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { useLatestBlockNumber } from '../../../services/ExplorerService'
import { CKBNodeModal } from '../CKBNodeComp/CKBNodeModal'
import styles from './styles.module.scss'

const { BACKUP_NODES: backupNodes } = config
const threshold = 20

const getTipFromNode = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'get_tip_block_number',
      params: [],
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.result
}

const MaintainAlert = () => {
  const [nodeModalVisible, setNodeModalVisible] = useState(false)

  const synced = useLatestBlockNumber()
  const { isActivated } = useCKBNode()
  const { data: tip } = useQuery(
    ['backup_nodes'],
    async () => {
      try {
        if (backupNodes.length === 0) return null

        const [tip1, tip2]: PromiseSettledResult<string>[] = await Promise.allSettled(backupNodes.map(getTipFromNode))
        if (tip1.status === 'fulfilled' && tip2.status === 'fulfilled') {
          if (!tip1.value && !tip2.value) return null
          if (+tip1.value > +tip2.value) return +tip1.value
          return +tip2.value
        }
        if (tip1.status === 'fulfilled') return +tip1.value
        if (tip2.status === 'fulfilled') return +tip2.value
        return null
      } catch {
        return null
      }
    },
    { refetchInterval: 12 * 1000 },
  )

  const lag = tip && synced ? tip - synced : 0

  return lag >= threshold && !isActivated ? (
    <>
      <div className={styles.container}>
        <Trans
          i18nKey="error.maintain"
          values={{ tip: tip?.toLocaleString('en'), lag: lag.toLocaleString('en') }}
          components={{
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            switcher: <span className={styles.clickable} onClick={() => setNodeModalVisible(true)} />,
          }}
        />
      </div>
      {nodeModalVisible ? <CKBNodeModal onClose={() => setNodeModalVisible(false)} /> : null}
    </>
  ) : null
}

export default MaintainAlert
