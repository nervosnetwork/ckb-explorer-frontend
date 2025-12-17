import { CSSProperties, ReactNode } from 'react'
import styles from './index.module.scss'
import Notification from '../Notification'

export default ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div className={styles.pagePanel} style={style}>
    <Notification />
    {children}
  </div>
)
