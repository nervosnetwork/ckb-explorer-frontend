import { FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { BannerRender, createBannerRender } from './render'
import styles from './index.module.scss'
import { useIsMobile, usePrevious } from '../../../utils/hook'

export const Banner: FC<{ latestBlock?: State.Block }> = ({ latestBlock }) => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [render, setRender] = useState<BannerRender>()

  useEffect(() => {
    if (!ref.current) return

    const render = createBannerRender(ref.current)
    setRender(render)
    return () => render.destroy()
  }, [])

  const prevLatestBlock = usePrevious(latestBlock)
  useEffect(() => {
    if (!latestBlock || !prevLatestBlock) return
    render?.onNewBlock(latestBlock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlock])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => render?.onResize(), [isMobile])

  return (
    <div className={classNames(styles.banner, { [styles.mobile]: isMobile })}>
      <div ref={ref} className={styles.renderer} />
    </div>
  )
}
