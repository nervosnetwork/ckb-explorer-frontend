import { useQuery } from '@tanstack/react-query'
import { BarChartIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { Link } from '../../../components/Link'
import config from '../../../config'
import styles from './index.module.scss'
import { getKnowledgeSize } from './utils'
import { NumberTicker } from '../../../components/ui/NumberTicker'
import { IS_MAINNET } from '../../../constants/common'

const { BACKUP_NODES: backupNodes } = config

export default () => {
  const [t] = useTranslation()
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
  if (IS_MAINNET) {
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

  return (
    <div className={styles.fiberBanner}>
      <div className={styles.slogan}>
        <h1>{t(`banner.fiber_title`)}</h1>
        <h3>{t(`banner.fiber_subtitle`)}</h3>
      </div>
      <div className={styles.links}>
        <Link to="https://www.ckbfiber.net/" target="_blank" rel="noopener noreferrer">
          <span>{t(`banner.learn_more`)}</span>
        </Link>
        <Tooltip title={t('banner.coming_soon')}>
          <Link
            to="/"
            aria-disabled
            onClick={(e: React.SyntheticEvent<HTMLAnchorElement>) => {
              e.preventDefault()
            }}
          >
            <span>{t('banner.find_nodes')}</span>
          </Link>
        </Tooltip>
      </div>
    </div>
  )
}
