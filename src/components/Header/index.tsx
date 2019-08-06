import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Search from '../Search'
import LogoIcon from '../../assets/ckb_logo.png'
import MobileLogoIcon from '../../assets/mobile_ckb_logo.png'
import SearchLogo from '../../assets/search.png'
import i18n from '../../utils/i18n'
import { HeaderDiv, HeaderMobileDiv, HeaderMobilePanel, HeaderVersionPanel, HeaderTestnetPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { AppContext } from '../../contexts/providers/index'
import { AppDispatch, ComponentActions } from '../../contexts/providers/reducer'

const MenuDatas = [
  {
    name: i18n.t('navbar.charts'),
    url: '/charts',
  },
]

const Menus = () => {
  return (
    <div className="header__menus">
      {MenuDatas.map(menu => {
        return (
          <Link className="header__menus__item" to={menu.url} key={menu.name}>
            {menu.name}
          </Link>
        )
      })}
    </div>
  )
}

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.indexOf('(') !== -1) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf('('))}`
  }
  return nodeVersion
}

export default ({
  search,
  width = window.innerWidth,
  dispatch,
}: {
  search?: boolean
  width?: number
  dispatch: AppDispatch
}) => {
  const { app, components } = useContext(AppContext)
  const { nodeVersion } = app
  const { searchBarEditable } = components

  return useMemo(() => {
    // normally rerender will not occur with useMemo
    if (isMobile(width)) {
      return (
        <>
          <HeaderMobilePanel searchBarEditable={!searchBarEditable}>
            <Search dispatch={dispatch} />
          </HeaderMobilePanel>
          <HeaderMobilePanel searchBarEditable={searchBarEditable}>
            <HeaderMobileDiv>
              <Link to="/" className="header__logo">
                <img className="header__logo__img" src={MobileLogoIcon} alt="logo" />
              </Link>
              <Menus />
              {search && (
                <div className="header__search">
                  <div
                    className="header__search__component"
                    role="button"
                    tabIndex={-1}
                    onClick={() => {
                      dispatch({
                        type: ComponentActions.UpdateHeaderSearchEditable,
                        payload: {
                          searchBarEditable: true,
                        },
                      })
                    }}
                    onKeyDown={() => {
                      dispatch({
                        type: ComponentActions.UpdateHeaderSearchEditable,
                        payload: {
                          searchBarEditable: true,
                        },
                      })
                    }}
                  >
                    <img className="header__search__image" src={SearchLogo} alt="search" />
                  </div>
                  <div className="header__search__separate" />
                </div>
              )}
              <HeaderTestnetPanel search={!!search}>
                <div className="header__testnet__flag">{i18n.t('navbar.network')}</div>
                <HeaderVersionPanel>
                  <div>{handleVersion(nodeVersion)}</div>
                </HeaderVersionPanel>
              </HeaderTestnetPanel>
            </HeaderMobileDiv>
          </HeaderMobilePanel>
        </>
      )
    }
    return (
      <>
        <HeaderDiv>
          <Link to="/" className="header__logo">
            <img className="header__logo__img" src={LogoIcon} alt="logo" />
          </Link>
          <Menus />
          {search && (
            <div className="header__search">
              <div className="header__search__component">
                <Search dispatch={dispatch} />
              </div>
            </div>
          )}
          <HeaderTestnetPanel search={!!search}>
            <div className="header__testnet__flag">{i18n.t('navbar.network')}</div>
            <HeaderVersionPanel>
              <div>{handleVersion(nodeVersion)}</div>
            </HeaderVersionPanel>
          </HeaderTestnetPanel>
        </HeaderDiv>
      </>
    )
  }, [dispatch, nodeVersion, search, width, searchBarEditable])
}
