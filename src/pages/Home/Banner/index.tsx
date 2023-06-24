import { FC, memo, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { getGPUTier } from 'detect-gpu'
import { BannerRender, createBannerRender } from './render'
import styles from './index.module.scss'
import { useIsMobile, usePrevious } from '../../../utils/hook'
import { isMainnet as isMainnetFunc } from '../../../utils/chain'
import BannerFallback from '../../../components/BannerFallback'

const GPUTier = {
  MIN_TIER: 2,
  key: 'gpu-info',
  get(): number | null {
    try {
      const cache = localStorage.getItem(this.key)
      return cache ? JSON.parse(cache).tier : null
    } catch {
      return null
    }
  },
  async update() {
    const info = await getGPUTier()
    const time = new Date().getTime()
    localStorage.setItem(this.key, JSON.stringify({ time, ...info }))
    return info.tier
  },
  async upsert() {
    const tier = this.get()
    return tier === null ? this.update() : tier
  },
}

// eslint-disable-next-line no-underscore-dangle
const _Banner: FC<{ latestBlock?: State.Block }> = ({ latestBlock }) => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [render, setRender] = useState<BannerRender>()
  const [gpuTier, setGPUTier] = useState<null | number>(GPUTier.get())

  const isFallbackDisplayed = gpuTier === null || gpuTier < GPUTier.MIN_TIER

  useEffect(() => {
    GPUTier.upsert().then(setGPUTier).catch(console.error)
  }, [setGPUTier])

  useEffect(() => {
    if (isFallbackDisplayed) return

    const container = ref.current
    if (!container) return
    try {
      const r = createBannerRender(container)
      setRender(r)
      return () => r.destroy()
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
      // ignore
    }
  }, [setRender, isFallbackDisplayed])

  const prevLatestBlock = usePrevious(latestBlock)
  useEffect(() => {
    if (!latestBlock || !prevLatestBlock) return
    render?.onNewBlock(latestBlock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlock])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => render?.onResize(), [isMobile])

  if (isFallbackDisplayed) {
    return (
      <div className={styles.fallback}>
        <BannerFallback />
      </div>
    )
  }

  return (
    <div className={classNames(styles.banner, { [styles.mobile]: isMobile })}>
      <div ref={ref} className={styles.renderer} />
    </div>
  )
}

/*
 * FIXME: this is a fallback for https://github.com/Magickbase/ckb-explorer-public-issues/issues/218 and should be restored once performance issue is fixed
 */
const isMainnet = isMainnetFunc()
export const Banner = isMainnet
  ? BannerFallback
  : memo(_Banner, (a, b) => a.latestBlock?.number === b.latestBlock?.number)
