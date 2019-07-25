import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Search from '../Search'
import logoIcon from '../../assets/ckb_logo.png'
import SearchLogo from '../../assets/search.png'
import i18n from '../../utils/i18n'
import { HeaderDiv, HeaderMobileDiv, HeaderMobilePanel, HeaderSearchPanel, HeaderVersionPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { AppContext } from '../../contexts/providers/index'
import { AppDispatch } from '../../contexts/providers/reducer'

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
          <Link className="header__menus__item" to={menu.url}>
            {menu.name}
          </Link>
        )
      })}
    </div>
  )
}

const NORMAL_HEIGHT = 42
const SEARCH_HEIGHT = 95

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
  const [height, setHeight] = useState(NORMAL_HEIGHT)
  const { app } = useContext(AppContext)
  const { nodeVersion } = app

  useEffect(() => {
    setHeight(NORMAL_HEIGHT)
  }, [setHeight])

  return useMemo(() => {
    // normally rerender will not occur with useMemo
    if (isMobile(width)) {
      return (
        <>
          <HeaderMobilePanel height={height}>
            <HeaderMobileDiv>
              <Link to="/" className="header__logo">
                <img className="header__logo__img" src={logoIcon} alt="logo" />
              </Link>
              <Menus />
              {search && (
                <div className="header__search">
                  <div
                    className="header__search__component"
                    onKeyDown={() => {}}
                    onClick={() => setHeight(height === NORMAL_HEIGHT ? SEARCH_HEIGHT : NORMAL_HEIGHT)}
                    role="button"
                    tabIndex={-1}
                  >
                    <img className="header__search__image" src={SearchLogo} alt="search" />
                  </div>
                  <div className="header__testnet">{i18n.t('navbar.network')}</div>
                </div>
              )}
              <HeaderVersionPanel>{handleVersion(nodeVersion)}</HeaderVersionPanel>
            </HeaderMobileDiv>
            <HeaderSearchPanel>{search && <Search dispatch={dispatch} />}</HeaderSearchPanel>
          </HeaderMobilePanel>
        </>
      )
    }
    return (
      <>
        <HeaderDiv>
          <Link to="/" className="header__logo">
            <img className="header__logo__img" src={logoIcon} alt="logo" />
          </Link>
          <Menus />
          {search && (
            <div className="header__search">
              <div className="header__search__component">
                <Search dispatch={dispatch} />
              </div>
              <div className="header__testnet__panel">
                <div className="header__testnet__flag">{i18n.t('navbar.network')}</div>
                <div className="header__testnet__tip">{i18n.t('navbar.network_tooltip')}</div>
              </div>
            </div>
          )}
          <HeaderVersionPanel>{handleVersion(nodeVersion)}</HeaderVersionPanel>
        </HeaderDiv>
      </>
    )
  }, [dispatch, nodeVersion, search, width, height])
}
