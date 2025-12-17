import { CSSProperties, ReactNode } from 'react'
import styles from './index.module.scss'

export default ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div className={styles.pagePanel} style={style}>
    {children}
  </div>
)
