import { Link, useLocation } from 'react-router-dom'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
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
  const [selected, setSelected] = useState<string>('')
  const { t, i18n } = useTranslation()
  const params = useSearchParams(filterName)
  const filter = params[filterName]

  const types = useMemo(() => filter?.split(',').filter(t => !!t) ?? [], [filter])

  useEffect(() => {
    const filterMap = new Map<string, string>(filterList.map(f => [f.key, f.value]))
    setSelected(
      types
        .map(item => filterMap.get(item))
        .filter(item => item)
        .join(','),
    )
  }, [filter, filterList, types])

  const isAllSelected = types.length === filterList.length
  const isNoneSelected = types.length === 0
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  search.delete(filterName)
  search.delete('page')

  return (
    <div className={styles.container}>
      {!!selected && (
        <div className={styles.selected}>
          <span className={styles.selectedItems}>{selected}</span>
          <span>+{types.length}</span>
        </div>
      )}
      <Popover
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
                    newSearch.append(filterName, filterList.map(f => f.key).join(','))
                  }

                  return `/${i18n.language}${filterList[0].to}?${newSearch.toString()}`
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
                  if (subTypes.has(f.key)) {
                    subTypes.delete(f.key)
                  } else {
                    subTypes.add(f.key)
                  }

                  const newSearch = new URLSearchParams(search)
                  if (subTypes.size === 0) {
                    newSearch.delete(filterName)
                  } else {
                    newSearch.append(filterName, Array.from(subTypes).join(','))
                  }
                  return `/${i18n.language}${f.to}?${newSearch.toString()}`
                }}
                data-is-active={types.includes(f.key)}
              >
                {f.title}
                {types.includes(f.key) ? <SelectedIcon /> : <NotSelectedIcon />}
              </Link>
            ))}
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon
            className={styles.filter}
            // if the filter is the empty string, display highlight
            // if the filter is the string list, display highlight
            // if the filter is undefined, not display highlight
            data-changed={filter !== undefined}
          />
        </div>
      </Popover>
    </div>
  )
}

MultiFilterButton.displayName = 'MultiFilterButton'

export default MultiFilterButton
