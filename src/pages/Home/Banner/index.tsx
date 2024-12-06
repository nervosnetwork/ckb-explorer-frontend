import { useQuery } from '@tanstack/react-query'
import { BarChartIcon } from '@radix-ui/react-icons'
import { Link } from '../../../components/Link'
import config from '../../../config'
import styles from './index.module.scss'
import { getKnowledgeSize } from './utils'
import { NumberTicker } from '../../../components/ui/NumberTicker'

const { BACKUP_NODES: backupNodes } = config

export default () => {
  const { data: size } = useQuery(
    ['backnode_tip_header'],
    async () => {
      try {
        if (backupNodes.length === 0) return null

        const size = await Promise.race(backupNodes.map(getKnowledgeSize))

        return size
      } catch {
        return null
      }
    },
    { refetchInterval: 12 * 1000 },
  )
  return (
    <div className={styles.root}>
      <div className={styles.knowledgeBase}>
        <span>Knowledge Size</span>
        <br />
        <div className={styles.ticker}>
          <NumberTicker value={size ? +size : null} />
          <span>CKBytes</span>
          <Link to="/charts/knowledge-size">
            <BarChartIcon color="white" />
          </Link>
        </div>
      </div>
    </div>
  )
}
