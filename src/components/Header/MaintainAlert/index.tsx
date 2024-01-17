import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import config from '../../../config'
import { useLatestBlockNumber } from '../../../services/ExplorerService'
import styles from './styles.module.scss'

const { BACKUP_NODES: backupNodes } = config
const thredhold = 20

const getTipFromNode = (url: string) =>
  axios<any, { result: string }>(url, {
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
    // FIXME: type declaration
  }).then((res: any) => res.data.result)

const MaintainAlert = () => {
  const { t } = useTranslation()
  const synced = useLatestBlockNumber()
  const { data: tip } = useQuery(
    ['backup_nodes'],
    async () => {
      try {
        if (backupNodes.length === 0) return null

        // FIXME: type declaration
        const [tip1, tip2]: any = await Promise.allSettled(backupNodes.map(getTipFromNode))
        if (!tip1.value && !tip2.value) return null
        if (+tip1.value > +tip2.value) return +tip1.value
        return +tip2.value
      } catch {
        return null
      }
    },
    { refetchInterval: 12 * 1000 },
  )

  const isMaintained = tip && synced && tip - synced > thredhold

  return isMaintained ? <div className={styles.container}>{t('error.maintain', { tip, lag: tip - synced })}</div> : null
}

export default MaintainAlert
