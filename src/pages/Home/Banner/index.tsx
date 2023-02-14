import { FC, useEffect, useRef, useState } from 'react'
import { createBannerRender } from './render'
import styles from './index.module.scss'
import { usePrevious } from '../../../utils/hook'

export const Banner: FC<{ latestBlock?: State.Block }> = ({ latestBlock }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [onNewBlock, setOnNewBlock] = useState<(block: State.Block) => void>()

  useEffect(() => {
    if (!ref.current) return

    const render = createBannerRender(ref.current)
    setOnNewBlock(() => render.onNewBlock)
    return () => render.destroy()
  }, [])

  const prevLatestBlock = usePrevious(latestBlock)
  useEffect(() => {
    if (!latestBlock || !prevLatestBlock) return
    onNewBlock?.(latestBlock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlock])

  return (
    <div className={styles.banner}>
      <div ref={ref} className={styles.renderer} />
    </div>
  )
}
