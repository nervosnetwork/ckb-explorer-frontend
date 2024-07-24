import { Link } from 'react-router-dom'
import { Popover } from 'antd'
import { ReactNode } from 'react'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { useSearchParams } from '../../hooks'
import styles from './styles.module.scss'

export function FilterButton({
  filteredList,
  isMobile,
  filterName,
}: {
  filterName: string
  filteredList: (Record<'key' | 'value' | 'to', string> & Record<'title', ReactNode | string>)[]
  isMobile?: boolean
}) {
  const { type } = useSearchParams('type')

  return (
    <Popover
      className={styles.container}
      placement="bottomRight"
      trigger={isMobile ? 'click' : 'hover'}
      overlayClassName={styles.antPopover}
      content={
        <div className={styles.filterItems}>
          {filteredList.map(f => (
            <Link key={f.key} to={`${f.to}?${filterName}=${f.value}`} data-is-active={f.value === type}>
              {f.title}
              <SelectedCheckIcon />
            </Link>
          ))}
        </div>
      }
    >
      <FilterIcon className={styles.filter} />
    </Popover>
  )
}

FilterButton.displayName = 'FilterButton'

export default FilterButton
