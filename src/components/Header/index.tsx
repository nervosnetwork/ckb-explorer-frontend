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
import { currentLanguage } from '../../utils/i18n'
import { useElementSize, useIsMobile } from '../../utils/hook'
import styles from './index.module.scss'

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

export default () => {
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const {
    components: { headerSearchBarVisible, maintenanceAlertVisible },
  } = useAppState()

  useEffect(() => {
    dispatch({
      type: ComponentActions.UpdateHeaderSearchBarVisible,
      payload: {
        headerSearchBarVisible: pathname !== '/' && pathname !== '/search/fail',
      },
    })
  }, [dispatch, pathname])

  return (
    <HeaderPanel isNotTop={maintenanceAlertVisible} isEn={currentLanguage() === 'en'}>
      <LogoComp />
      {!isMobile && (
        <>
          <AutoExpand
            leftContent={<MenusComp />}
            expandableWidthRange={{ minimum: 320, maximum: 440 }}
            renderExpandable={(expanded, setExpanded) =>
              headerSearchBarVisible && <SearchComp expanded={expanded} setExpanded={setExpanded} />
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
  )
}
