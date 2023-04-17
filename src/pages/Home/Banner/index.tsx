import { FC, memo, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { BannerRender, createBannerRender } from './render'
import styles from './index.module.scss'
import { useIsMobile, usePrevious } from '../../../utils/hook'
import BannerFallback from '../../../components/BannerFallback'
import { tinyTestSceneRender } from './tinyTestScene'

// eslint-disable-next-line no-underscore-dangle
const _Banner: FC<{ latestBlock?: State.Block; fallbackThreshold: number }> = ({ latestBlock, fallbackThreshold }) => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [render, setRender] = useState<BannerRender>()

  useEffect(() => {
    const container = ref.current
    if (!container) return
    try {
      // The `tinyTestSceneRender` is used to determine whether the performance of browser is sufficient to render the three.js animated banner
      // Related issue: https://github.com/Magickbase/ckb-explorer-public-issues/issues/218
      const testRenderTime = tinyTestSceneRender(container)
      // eslint-disable-next-line no-console
      console.log(`duration: ${testRenderTime} , threshold: ${fallbackThreshold}`)
      if (testRenderTime < fallbackThreshold) {
        const r = createBannerRender(container)
        setRender(r)
        return () => r.destroy()
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
      // ignore
    }
  }, [setRender, fallbackThreshold])

  const prevLatestBlock = usePrevious(latestBlock)
  useEffect(() => {
    if (!latestBlock || !prevLatestBlock) return
    render?.onNewBlock(latestBlock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlock])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => render?.onResize(), [isMobile])

  return (
    <div className={styles.container} data-is-fallback={!render}>
      <BannerFallback />
      <div className={classNames(styles.banner, { [styles.mobile]: isMobile })}>
        <div ref={ref} className={styles.renderer} />
      </div>
    </div>
  )
}
export const Banner = memo(_Banner, (a, b) => a.latestBlock?.number === b.latestBlock?.number)
