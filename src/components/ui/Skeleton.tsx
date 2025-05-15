import { CSSProperties, FC } from 'react'
import classnames from 'classnames'
import styles from './Skeleton.module.scss'

const Skeleton: FC<{
  shape?: 'circle' | 'square'
  className?: string
  style?: CSSProperties
}> = ({ shape = 'square', className, style }) => {
  return <div className={classnames(styles.skeleton, shape === 'circle' && styles.circle, className)} style={style} />
}

export default Skeleton
