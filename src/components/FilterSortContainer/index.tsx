import classNames from 'classnames'
import { ComponentProps, FC } from 'react'
import styles from './index.module.scss'

export const FilterSortContainerOnMobile: FC<ComponentProps<'div'>> = ({ children, ...elProps }) => {
  return (
    <div {...elProps} className={classNames(styles.filterSortContainerOnMobile, elProps.className)}>
      {children}
    </div>
  )
}
