import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import LogoIcon from '../../assets/ckb_logo.png'
import { HeaderPanel, HeaderEmptyPanel, HeaderMobileMenuPanel, HeaderLogoPanel } from './styled'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { ComponentActions } from '../../contexts/actions'
import MenusComp from './MenusComp'
import { SearchComp } from './SearchComp'
import LanguageComp from './LanguageComp'
import BlockchainComp from './BlockchainComp'
import { useElementSize, useIsMobile } from '../../utils/hook'
import styles from './index.module.scss'
import Alert from '../Alert'
import Sheet from '../Sheet'
import { createGlobalState, useGlobalState } from '../../utils/state'

const LogoComp = () => (
  <HeaderLogoPanel to="/">
    <img src={LogoIcon} alt="logo" />
  </HeaderLogoPanel>
)

const MobileMenuComp = () => {
  const dispatch = useDispatch()
  const {
    components: { mobileMenuVisible },
  } = useAppState()
  return (
    <HeaderMobileMenuPanel
      onClick={() => {
        dispatch({
          type: ComponentActions.UpdateHeaderMobileMenuVisible,
          payload: {
            mobileMenuVisible: !mobileMenuVisible,
          },
        })
      }}
    >
      <div className={mobileMenuVisible ? 'close' : ''}>
        <div className="menu__icon__first" />
        <div className="menu__icon__second" />
        <div className="menu__icon__third" />
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
    <div className={styles.AutoExpand}>
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

export default () => {
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  // TODO: This hard-coded implementation is not ideal, but currently the header is loaded before the page component,
  // so we can only handle it this way temporarily, otherwise there will be flickering during loading.
  const defaultSearchBarVisible = pathname !== '/' && pathname !== '/search/fail'
  const isShowSearchBar = useIsShowSearchBarInHeader()

  return (
    <div className={styles.StickyContainer}>
      <Alert />
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
            <LanguageComp />
          </>
        )}
        {isMobile && (
          <>
            <HeaderEmptyPanel />
            <MobileMenuComp />
          </>
        )}
      </HeaderPanel>
      <Sheet />
    </div>
  )
}
