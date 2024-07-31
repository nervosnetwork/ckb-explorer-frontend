import classNames from 'classnames'
import { ComponentProps, FC, ReactNode } from 'react'
import styles from './index.module.scss'

export const FilterSortContainerOnMobile: FC<ComponentProps<'div'>> = ({ children, ...elProps }) => {
  const items = Array.from(children as Iterable<ReactNode>).map((child, index) => ({
    child,
    key: `${elProps.key}${index}`,
  }))
  return (
    <div {...elProps} className={classNames(styles.filterSortContainerOnMobile, elProps.className)}>
      <ul>
        {items.map(({ child, key }) => (
          <li key={key}>{child}</li>
        ))}
      </ul>
    </div>
  )
}
