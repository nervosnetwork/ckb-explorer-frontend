import React, { useEffect } from 'react'
import LogoIcon from '../../assets/ckb_logo.png'
import { HeaderPanel, HeaderEmptyPanel, HeaderMobileMenuPanel, HeaderLogoPanel } from './styled'
import { isMobile, isScreen750to1440 } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { ComponentActions } from '../../contexts/actions'
import MenusComp from './MenusComp'
import { SearchComp } from './SearchComp'
import LanguageComp from './LanguageComp'
import BlockchainComp from './BlockchainComp'
import { useLocation } from 'react-router'
import { AppDispatch } from '../../contexts/reducer'
import { currentLanguage } from '../../utils/i18n'

const LogoComp = () => {
  return (
    <HeaderLogoPanel to="/">
      <img src={LogoIcon} alt="logo" />
    </HeaderLogoPanel>
  )
}

const headerMenuAction = (dispatch: AppDispatch, mobileMenuVisible: boolean) => {
  dispatch({
    type: ComponentActions.UpdateHeaderMobileMenuVisible,
    payload: {
      mobileMenuVisible: !mobileMenuVisible,
    },
  })
}

const MobileMenuComp = () => {
  const dispatch = useDispatch()
  const {
    components: { mobileMenuVisible },
  } = useAppState()
  return (
    <HeaderMobileMenuPanel onClick={() => headerMenuAction(dispatch, mobileMenuVisible)}>
      <div className={mobileMenuVisible ? 'close' : ''}>
        <div className="menu__icon__first" />
        <div className="menu__icon__second" />
        <div className="menu__icon__third" />
      </div>
    </HeaderMobileMenuPanel>
  )
}

export default () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const {
    components: { searchBarEditable, headerSearchBarVisible, maintenanceAlertVisible },
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
      {!isMobile() && (
        <>
          {!(isScreen750to1440() && searchBarEditable && headerSearchBarVisible) && <MenusComp />}
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
