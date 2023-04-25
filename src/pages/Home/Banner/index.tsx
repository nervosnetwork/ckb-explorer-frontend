import { FC, memo, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { BannerRender, createBannerRender } from './render'
import styles from './index.module.scss'
import { useIsMobile, usePrevious } from '../../../utils/hook'
import { isMainnet as isMainnetFunc } from '../../../utils/chain'
import BannerFallback from '../../../components/BannerFallback'

// eslint-disable-next-line no-underscore-dangle
const _Banner: FC<{ latestBlock?: State.Block }> = ({ latestBlock }) => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [render, setRender] = useState<BannerRender>()

  useEffect(() => {
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
  }, [setRender])

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

/*
 * FIXME: this is a fallback for https://github.com/Magickbase/ckb-explorer-public-issues/issues/218 and should be restored once performance issue is fixed
 */
const isMainnet = isMainnetFunc()
export const Banner = isMainnet
  ? BannerFallback
  : memo(_Banner, (a, b) => a.latestBlock?.number === b.latestBlock?.number)
