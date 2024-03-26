import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import styles from './Capacity.module.scss'

interface CapacityProps {
  capacity: string
  type?: 'value' | 'diff'
  layout?: 'responsive' | 'fixed'
  unit?: 'CKB' | string | null
  display?: 'full' | 'short'
}

const Capacity: React.FC<CapacityProps> = ({
  capacity,
  type = 'value',
  layout = 'fixed',
  unit = 'CKB',
  display = 'full',
}) => {
  const [int, dec, diffStatus] = useMemo(() => {
    const c = new BigNumber(capacity)
    const [int, dec] = c.toFormat(display === 'full' ? 8 : undefined).split('.')
    if (type !== 'diff' || c.isZero()) return [int, dec]
    if (c.isPositive()) return [int, dec, 'positive']
    return [int, dec, 'negative']
  }, [capacity, display, type])

  return (
    <div className={styles.container} data-type={type} data-diff-status={diffStatus} data-layout={layout}>
      <span data-role="int">{int}</span>
      {dec ? (
        <span data-role="dec" className="monospace">
          {`.${dec}`}
        </span>
      ) : null}
      {unit && <span className={`${styles.unit} monospace`}>{unit}</span>}
    </div>
  )
}

export default Capacity
