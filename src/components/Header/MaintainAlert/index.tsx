import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import config from '../../../config'
import { useLatestBlockNumber } from '../../../services/ExplorerService'
import styles from './styles.module.scss'

const { BACKUP_NODES: backupNodes } = config
const thredhold = 20

const getTipFromNode = (url: string): Promise<string> =>
  axios<any, { data: { result: string } }>(url, {
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'get_tip_block_number',
      params: [],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.data.result)

const MaintainAlert = () => {
  const { t } = useTranslation()
  const synced = useLatestBlockNumber()
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

  return lag >= thredhold ? (
    <div className={styles.container}>
      {t('error.maintain', { tip: tip?.toLocaleString('en'), lag: lag.toLocaleString('en') })}
    </div>
  ) : null
}

export default MaintainAlert
