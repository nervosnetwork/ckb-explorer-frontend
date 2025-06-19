import { ReactNode } from 'react'
import styles from './styles.module.scss'
import { localeNumberString } from '../../../utils/number'
import MoreIcon from '../../../assets/more.png'
import Tooltip from '..'

export default ({
  numerator,
  maxInEpoch,
  maxInChain,
  titleInEpoch,
  titleInChain,
  children,
  unit,
}: {
  numerator: number | null
  maxInEpoch: number | null
  maxInChain: number | null
  titleInEpoch: string
  titleInChain: string
  children?: ReactNode
  unit?: string
}) => {
  const percentOfMaxInEpoch = numerator && maxInEpoch ? Math.round((10000 * numerator) / maxInEpoch) / 100 : 0
  const percentOfMaxInChain = numerator && maxInChain ? Math.round((10000 * numerator) / maxInChain) / 100 : 0

  return (
    <Tooltip
      placement="top"
      contentClassName={styles.comparedSizeTooltip}
      trigger={
        <img
          src={MoreIcon}
          alt="more"
          style={{
            width: 15,
            height: 15,
            marginLeft: 6,
          }}
        />
      }
    >
      <>
        {maxInEpoch ? (
          <div className={styles.inEpoch}>
            <div>{titleInEpoch}</div>
            <div>
              {localeNumberString(maxInEpoch)}
              {unit ? ` ${unit}` : ''} ({percentOfMaxInEpoch}%)
            </div>
            <div style={{ backgroundColor: '#999', height: 10, borderRadius: 4 }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  height: 10,
                  width: `${Math.max(percentOfMaxInEpoch, 2)}%`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ) : null}
        {maxInChain ? (
          <div className={styles.inChain}>
            <div>{titleInChain}</div>
            <div>
              {localeNumberString(maxInChain)}
              {unit ? ` ${unit}` : ''} ({percentOfMaxInChain}%)
            </div>
            <div style={{ backgroundColor: '#999', height: 10, borderRadius: 4 }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  height: 10,
                  width: `${Math.max(percentOfMaxInChain, 2)}%`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ) : null}
        {children ? <hr /> : ''}
        {children}
      </>
    </Tooltip>
  )
}
