import { CSSProperties, ReactNode } from 'react'
import styles from './index.module.scss'

export default ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  return (
    <div style={style} className={styles.contentPanel}>
      {children}
    </div>
  )
}
