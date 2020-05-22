import React, { useEffect } from 'react'
import LogoIcon from '../../assets/ckb_logo.png'
import MobileMenuIcon from '../../assets/menu_mobile.png'
import MobileMenuCloseIcon from '../../assets/menu_close_mobile.png'
import { HeaderPanel, HeaderEmptyPanel, HeaderMobileMenuPanel, HeaderLogoPanel } from './styled'
import { isMobile, isScreen750to1440 } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { ComponentActions } from '../../contexts/actions'
import MenusComp from './MenusComp'
import { SearchComp } from './SearchComp'
import LanguageComp from './LanguageComp'
import BlockchainComp from './BlockchainComp'
import { useLocation } from 'react-router'

const LogoComp = () => {
  return (
    <HeaderLogoPanel to="/">
      <img src={LogoIcon} alt="logo" />
    </HeaderLogoPanel>
  )
}

const MobileMenuComp = () => {
  const dispatch = useDispatch()
  const {
    components: { mobileMenuVisible },
  } = useAppState()
  return (
    <HeaderMobileMenuPanel
      role="button"
      tabIndex={-1}
      onKeyDown={() => {}}
      onClick={() => {
        dispatch({
          type: ComponentActions.UpdateHeaderMobileMenuVisible,
          payload: {
            mobileMenuVisible: !mobileMenuVisible,
          },
        })
      }}
    >
      <img alt="header mobile menu" src={mobileMenuVisible ? MobileMenuCloseIcon : MobileMenuIcon} />
    </HeaderMobileMenuPanel>
  )
}

export default () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const {
    components: { searchBarEditable, headerSearchBarVisible },
  } = useAppState()

  useEffect(() => {
    dispatch({
      type: ComponentActions.UpdateHeaderSearchBarVisible,
      payload: {
        headerSearchBarVisible: pathname !== '/' && pathname !== '/search/fail' && pathname !== '/maintain',
      },
    })
  }, [dispatch, pathname])

  return (
    <HeaderPanel>
      <LogoComp />
      {!isMobile() && (
        <>
          {!(isScreen750to1440() && searchBarEditable && !headerSearchBarVisible) && <MenusComp />}
          <HeaderEmptyPanel />
          {headerSearchBarVisible && <SearchComp />}
          <BlockchainComp />
          <LanguageComp />
        </>
      )}
      {isMobile() && (
        <>
          <HeaderEmptyPanel />
          <MobileMenuComp />
        </>
      )}
    </HeaderPanel>
  )
}
