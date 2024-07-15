import { Link, useLocation } from 'react-router-dom'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedIcon } from '../../assets/selected-icon.svg'
import { ReactComponent as NotSelectedIcon } from '../../assets/not-selected-icon.svg'
import { ReactComponent as PartialSelectedIcon } from '../../assets/partial-selected-icon.svg'
import { useSearchParams } from '../../hooks'
import styles from './styles.module.scss'

export function MultiFilterButton({
  filterList,
  isMobile,
  filterName,
}: {
  filterName: string
  filterList: { key: string; value: string; to: string; title: string | JSX.Element }[]
  isMobile?: boolean
}) {
  const { t } = useTranslation()
  const params = useSearchParams(filterName)
  const filter = params[filterName]
  const types = filter?.split(',').filter(t => !!t) ?? []

  const isAllSelected = types.length === filterList.length
  const isNoneSelected = types.length === 0
  const search = new URLSearchParams(useLocation().search)
  search.delete(filterName)
  search.delete('page')

  return (
    <Popover
      className={styles.container}
      placement="bottomRight"
      trigger={isMobile ? 'click' : 'hover'}
      overlayClassName={styles.antPopover}
      content={
        <div className={styles.filterItems}>
          <div className={styles.selectTitle}>
            <h2>{t('components.multi_filter_button.select')}</h2>
            <Link
              key="all"
              to={() => {
                const newSearch = new URLSearchParams(search)
                if (isNoneSelected) {
                  newSearch.append(filterName, filterList.map(f => f.value).join(','))
                }

                return `${filterList[0].to}?${newSearch.toString()}`
              }}
            >
              {types.length > 0 ? (
                <>{isAllSelected ? <SelectedIcon /> : <PartialSelectedIcon />}</>
              ) : (
                <NotSelectedIcon />
              )}
            </Link>
          </div>
          {filterList.map(f => (
            <Link
              key={f.key}
              to={() => {
                const subTypes = new Set(types)
                if (subTypes.has(f.value)) {
                  subTypes.delete(f.value)
                } else {
                  subTypes.add(f.value)
                }

                const newSearch = new URLSearchParams(search)
                newSearch.append(filterName, Array.from(subTypes).join(','))
                return `${f.to}?${newSearch.toString()}`
              }}
              data-is-active={types.includes(f.value)}
            >
              {f.title}
              {types.includes(f.value) ? <SelectedIcon /> : <NotSelectedIcon />}
            </Link>
          ))}
        </div>
      }
    >
      <FilterIcon
        className={styles.filter}
        // if the filter is the empty string, display highlight
        // if the filter is the string list, display highlight
        // if the filter is undefined, not display highlight
        data-changed={filter !== undefined}
      />
    </Popover>
  )
}

MultiFilterButton.displayName = 'MultiFilterButton'

export default MultiFilterButton
