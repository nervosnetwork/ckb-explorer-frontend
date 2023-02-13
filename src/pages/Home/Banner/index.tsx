import { FC, useEffect, useRef, useState } from 'react'
import { useAppState } from '../../../contexts/providers'
import { createBannerRender } from './render'
import styles from './index.module.scss'

export const Banner: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    statistics: { tipBlockNumber },
  } = useAppState()
  const [onNewBlock, setOnNewBlock] = useState<() => void>()

  useEffect(() => {
    if (!ref.current) return

    const render = createBannerRender(ref.current)
    setOnNewBlock(() => render.onNewBlock)
    // eslint-disable-next-line consistent-return
    return () => render.destroy()
  }, [])

  const prevTipBlockNumber = useRef(tipBlockNumber)
  useEffect(() => {
    if (tipBlockNumber !== prevTipBlockNumber.current && prevTipBlockNumber.current !== '0') {
      onNewBlock?.()
    }
    prevTipBlockNumber.current = tipBlockNumber
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipBlockNumber])

  return (
    <div className={styles.banner}>
      <div ref={ref} className={styles.renderer} />
    </div>
  )
}
