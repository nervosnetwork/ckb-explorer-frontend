import { FC, memo, useCallback } from 'react'
import Search from '../../Search'
import styles from './index.module.scss'

export const SearchComp: FC<{
  setExpanded?: (expanded: boolean) => void
  hideMobileMenu?: () => void
}> = memo(({ hideMobileMenu }) => {
  const onEditEnd = useCallback(() => {
    if (hideMobileMenu) {
      setTimeout(() => hideMobileMenu(), 100)
    }
  }, [hideMobileMenu])

  return (
    <div className={styles.headerSearchPanel}>
      <Search onEditEnd={onEditEnd} />
    </div>
  )
})
