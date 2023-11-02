import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import styles from './styles.module.scss'
import { useSortParam } from '../../utils/hook'

/*
 * REFACTOR: could be refactored for https://github.com/Magickbase/ckb-explorer-frontend/pull/8#discussion_r1267484265
 */
export function SortButton<T extends string>({
  field,
  sortParam,
}: {
  field: T
  sortParam?: ReturnType<typeof useSortParam<T>>
}) {
  const sortParamByQuery = useSortParam()
  const { sortBy, orderBy, handleSortClick } = sortParam ?? sortParamByQuery
  const isActive = sortBy === field

  const handleClick = () => {
    handleSortClick(field)
  }

  return (
    <button type="button" className={styles.container} data-order={isActive ? orderBy : null} onClick={handleClick}>
      <SortIcon />
    </button>
  )
}

SortButton.displayName = 'SortButton'

export default SortButton
