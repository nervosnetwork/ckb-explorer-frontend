import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import classNames from 'classnames'
import { createBrowserHistory } from 'history'
import LogoIcon from './ckb_logo.png'
import { HeaderPanel, HeaderEmptyPanel, HeaderMobileMenuPanel, HeaderLogoPanel } from './styled'
import MenusComp from './MenusComp'
import { SearchComp } from './SearchComp'
import { LanguageDropdown } from './LanguageComp'
import BlockchainComp from './BlockchainComp'
import { useElementSize, useIsMobile } from '../../utils/hook'
import styles from './index.module.scss'
import MaintainAlert from '../MaintainAlert'
import Sheet from '../Sheet'
import { createGlobalState, useGlobalState } from '../../utils/state'
import MobileMenu from './MobileMenu'

const LogoComp = () => (
  <HeaderLogoPanel to="/">
    <img src={LogoIcon} alt="logo" />
  </HeaderLogoPanel>
)

const MobileMenuComp: FC<{ mobileMenuVisible: boolean; setMobileMenuVisible: (value: boolean) => void }> = ({
  mobileMenuVisible,
  setMobileMenuVisible,
}) => {
  return (
    <HeaderMobileMenuPanel onClick={() => setMobileMenuVisible(!mobileMenuVisible)}>
      <div className={mobileMenuVisible ? 'close' : ''}>
        <div className="menuIconFirst" />
        <div className="menuIconSecond" />
        <div className="menuIconThird" />
      </div>
    </HeaderMobileMenuPanel>
  )
}

const AutoExpand: FC<{
  leftContent: ReactNode
  expandableWidthRange: { minimum: number; maximum: number }
  renderExpandable: (expanded: boolean, setExpanded: (expanded: boolean) => void) => ReactNode
}> = ({ leftContent, expandableWidthRange, renderExpandable }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [_expanded, setExpanded] = useState(false)

  const { width } = useElementSize(ref)
  const canMinimumRender = width != null && width >= expandableWidthRange.minimum
  const expanded = canMinimumRender || _expanded

  return (
    <div className={styles.autoExpand}>
      {!_expanded && <div className={styles.content}>{leftContent}</div>}
      <div ref={ref} className={styles.expandable} style={{ width: _expanded ? '100%' : expandableWidthRange.minimum }}>
        {renderExpandable(expanded, setExpanded)}
      </div>
    </div>
  )
}

const globalShowHeaderSearchBarCounter = createGlobalState<number>(0)

export function useShowSearchBarInHeader(show: boolean) {
  const [, setCounter] = useGlobalState(globalShowHeaderSearchBarCounter)

  useEffect(() => {
    if (!show) return

    setCounter(counter => counter + 1)
    return () => setCounter(counter => counter - 1)
  }, [show, setCounter])
}

export function useIsShowSearchBarInHeader() {
  const [counter] = useGlobalState(globalShowHeaderSearchBarCounter)
  return counter > 0
}

const useRouterLocation = (callback: () => void) => {
  const history = createBrowserHistory()
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const currentCallback = () => {
      savedCallback.current()
    }
    const listen = history.listen(() => {
      currentCallback()
    })
    return () => {
      listen()
    }
  }, [history])
}

export default () => {
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  // TODO: This hard-coded implementation is not ideal, but currently the header is loaded before the page component,
  // so we can only handle it this way temporarily, otherwise there will be flickering during loading.
  const defaultSearchBarVisible = pathname !== '/' && pathname !== '/search/fail'
  const isShowSearchBar = useIsShowSearchBarInHeader()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  useRouterLocation(() => setMobileMenuVisible(false))

  return (
    <div
      className={classNames(styles.stickyContainer, {
        [styles.expanded]: mobileMenuVisible,
      })}
    >
      <MaintainAlert />
      <HeaderPanel>
        <LogoComp />
        {!isMobile && (
          <>
            <AutoExpand
              leftContent={<MenusComp />}
              expandableWidthRange={{ minimum: 320, maximum: 440 }}
              renderExpandable={(expanded, setExpanded) =>
                (defaultSearchBarVisible || isShowSearchBar) && (
                  <SearchComp expanded={expanded} setExpanded={setExpanded} />
                )
              }
            />
            <BlockchainComp />
            <LanguageDropdown />
          </>
        )}
        {isMobile && (
          <>
            <HeaderEmptyPanel />
            <MobileMenuComp mobileMenuVisible={mobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
          </>
        )}
      </HeaderPanel>
      <Sheet />
      {mobileMenuVisible && <MobileMenu hideMobileMenu={() => setMobileMenuVisible(false)} />}
    </div>
  )
}
