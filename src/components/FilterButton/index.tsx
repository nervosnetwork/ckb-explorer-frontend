import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { useSearchParams } from '../../hooks'
import styles from './styles.module.scss'
import Popover from '../Popover'

export function FilterButton({
  filteredList,
  filterName,
}: {
  filterName: string
  filteredList: (Record<'key' | 'value' | 'to', string> & Record<'title', ReactNode | string>)[]
}) {
  const { type } = useSearchParams('type')

  return (
    <Popover trigger={<FilterIcon className={styles.filter} />}>
      <div className={styles.filterItems}>
        {filteredList.map(f => (
          <Link key={f.key} to={`${f.to}?${filterName}=${f.value}`} data-is-active={f.value === type}>
            {f.title}
            <SelectedCheckIcon />
          </Link>
        ))}
      </div>
    </Popover>
  )
}

FilterButton.displayName = 'FilterButton'

export default FilterButton
