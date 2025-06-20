import { FC } from 'react'
import styles from './index.module.scss'

export const MobileMenuItem: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.mobileMenuItem}>{children}</div>
)
