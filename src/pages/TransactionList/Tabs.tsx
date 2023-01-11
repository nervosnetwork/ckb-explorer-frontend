import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import styles from './index.module.scss'

interface TabItem {
  label: string
  key: string
  children: ReactNode
}

const Tab: FC<{
  item: TabItem
  active: boolean
  onActive: (key: string) => void
  to?: string
}> = ({ item, active, onActive, to }) => {
  const refLink = useRef<HTMLAnchorElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)

  // This is not done using Element.scrollIntoView because it causes the user's window to scroll as well.
  function scrollTabIntoView() {
    const el = refLink.current ?? refDiv.current
    const parent = el?.parentElement
    if (!el || !parent) return

    parent.scrollLeft = el.offsetLeft + el.clientWidth - parent.clientWidth
  }

  useEffect(() => {
    if (!active) return
    scrollTabIntoView()
  }, [active])

  return to ? (
    <Link ref={refLink} className={classNames(styles.tab, { [styles.active]: active })} to={to}>
      {item.label}
    </Link>
  ) : (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={refDiv}
      className={classNames(styles.tab, { [styles.active]: active })}
      onClick={() => onActive(item.key)}
    >
      {item.label}
    </div>
  )
}

export const Tabs: FC<{
  items: TabItem[]
  activeKey?: string
  getItemLink?: (key: string) => string
}> = ({ items, activeKey: activeKeyFromOuter, getItemLink }) => {
  const [activeKey, setActiveKey] = useState(activeKeyFromOuter ?? items[0]?.key)
  const activeItem = items.find(item => item.key === activeKey) ?? items[0]

  useEffect(() => {
    if (activeKeyFromOuter != null) {
      setActiveKey(activeKeyFromOuter)
    }
  }, [activeKeyFromOuter])

  return (
    <div className={styles.tabs}>
      <div className={styles.nav}>
        {items.map(item => (
          <Tab
            key={item.key}
            item={item}
            active={item.key === activeKey}
            onActive={setActiveKey}
            to={getItemLink?.(item.key)}
          />
        ))}
      </div>

      {activeItem.children}
    </div>
  )
}
