import { ReactNode } from 'react'
import { Progress, Tooltip } from 'antd'
import styles from './styles.module.scss'
import { localeNumberString } from '../../../utils/number'
import MoreIcon from '../../../assets/more.png'

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
      overlayClassName={styles.comparedSizeTooltip}
      title={
        <>
          {maxInEpoch ? (
            <div className={styles.inEpoch}>
              <div>{titleInEpoch}</div>
              <div>
                {localeNumberString(maxInEpoch)}
                {unit ? ` ${unit}` : ''} ({percentOfMaxInEpoch}%)
              </div>
              <Progress percent={percentOfMaxInEpoch} showInfo={false} />
            </div>
          ) : null}
          {maxInChain ? (
            <div className={styles.inChain}>
              <div>{titleInChain}</div>
              <div>
                {localeNumberString(maxInChain)}
                {unit ? ` ${unit}` : ''} ({percentOfMaxInChain}%)
              </div>
              <Progress percent={percentOfMaxInChain} showInfo={false} />
            </div>
          ) : null}
          {children ? <hr /> : ''}
          {children}
        </>
      }
    >
      <img
        src={MoreIcon}
        alt="more"
        style={{
          width: 15,
          height: 15,
          marginLeft: 6,
        }}
      />
    </Tooltip>
  )
}
