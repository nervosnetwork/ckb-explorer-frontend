import { useQuery } from '@tanstack/react-query'
import { BarChartIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from '../../../components/Link'
import config from '../../../config'
import styles from './index.module.scss'
import { getKnowledgeSize } from './utils'
import { NumberTicker } from '../../../components/ui/NumberTicker'
import { IS_MAINNET } from '../../../constants/common'
import { HalvingBanner } from './HalvingBanner'

const { BACKUP_NODES: backupNodes } = config

// 定义轮播图内容类型
type BannerItem = {
  key: string
  component: React.ReactNode
}

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

  // mainnet banners
  const mainnetBanners: BannerItem[] = [
    {
      key: 'knowledge',
      component: (
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
      ),
    },
    // {
    //   key: 'halving',
    //   component: <HalvingBanner />,
    // },
  ]

  // testnet banners
  const testnetBanners: BannerItem[] = [
    {
      key: 'fiber',
      component: (
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
                to="/fiber/graph/nodes"
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
      ),
    },
    {
      key: 'testHalving',
      component: <HalvingBanner />,
    },
  ]

  const banners = IS_MAINNET ? mainnetBanners : testnetBanners

  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const exitingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToBanner = useCallback(
    (index: number) => {
      if (banners.length <= 1) return

      if (exitingIndex !== null) return
      if (index === currentIndex) return

      setExitingIndex(currentIndex)

      setCurrentIndex(index)

      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }

      if (exitingTimeoutRef.current) {
        clearTimeout(exitingTimeoutRef.current)
      }

      exitingTimeoutRef.current = setTimeout(() => {
        setExitingIndex(null)
        startAutoPlay()
      }, 800)
    },
    [currentIndex, banners.length, exitingIndex],
  )

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    autoPlayRef.current = setInterval(() => {
      goToBanner((currentIndex + 1) % banners.length)
    }, 7000)
  }, [goToBanner])

  useEffect(() => {
    startAutoPlay()
  }, [startAutoPlay])

  return (
    <div className={styles.bannerCarousel}>
      <div className={styles.bannerContainer}>
        {banners.map((banner, index) => {
          const isActive = index === currentIndex || index === exitingIndex
          if (!isActive) return null

          return (
            <div
              key={banner.key}
              className={`
                ${styles.bannerItem} 
                ${index === currentIndex ? styles.currentBanner : ''} 
                ${index === exitingIndex ? styles.exitingBanner : ''}
              `}
            >
              {banner.component}
              {index === exitingIndex && <div className={styles.pixelDissolve} />}
            </div>
          )
        })}
      </div>

      {banners.length > 1 && (
        <div className={styles.carouselDots}>
          {banners.map((banner, index) => (
            <div
              key={banner.key}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => goToBanner(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
