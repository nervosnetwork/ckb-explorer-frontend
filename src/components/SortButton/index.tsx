import { useHistory, useLocation } from 'react-router-dom'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import styles from './styles.module.scss'

enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

/*
 * REFACTOR: could be refactored for https://github.com/Magickbase/ckb-explorer-frontend/pull/8#discussion_r1267484265
 */
const SortButton: React.FC<{
  field: string
}> = ({ field }) => {
  const { push } = useHistory()
  const { search, pathname } = useLocation()

  const query = new URLSearchParams(search)

  const [sortKey, sortOrder] = query.get('sort')?.split('.') ?? []

  const isActive = sortKey === field

  const handleClick = () => {
    const shouldAsc = isActive && sortOrder === SortOrder.Desc
    push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(query),
        sort: shouldAsc ? `${field}.${SortOrder.Asc}` : `${field}.${SortOrder.Desc}`,
      })}`,
    )
  }

  return (
    <button type="button" className={styles.container} data-order={isActive ? sortOrder : null} onClick={handleClick}>
      <SortIcon />
    </button>
  )
}

SortButton.displayName = 'SortButton'

export default SortButton
