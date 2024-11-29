import { useQuery } from '@tanstack/react-query'
import config from '../../../config'
import styles from './index.module.scss'
import { getKnowledgeSize } from './utils'
import { NumberTicker } from '../../../components/ui/NumberTicker'

const { BACKUP_NODES: backupNodes } = config

export default () => {
  const { data: size } = useQuery(
    ['backup_nodes'],
    async () => {
      try {
        if (backupNodes.length === 0) return null

        const [size1, size2] = await Promise.race(backupNodes.map(getKnowledgeSize))
        return size1 ?? size2
      } catch {
        return null
      }
    },
    { refetchInterval: 12 * 1000 },
  )
  return (
    <div className={styles.root}>
      <a
        className={styles.knowledgeBase}
        target="_blank"
        rel="noopener noreferrer"
        href="https://talk.nervos.org/t/how-to-get-the-average-occupied-bytes-per-live-cell-in-ckb/7138/2?u=keith"
      >
        <span>Knowledge Size</span>
        <br />
        <div className={styles.ticker}>
          <NumberTicker value={size ? +size : null} />
          <span>CKBytes</span>
        </div>
      </a>
    </div>
  )
}
