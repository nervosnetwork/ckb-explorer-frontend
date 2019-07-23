import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Search from '../Search'
import logoIcon from '../../assets/ckb_logo.png'
import SearchLogo from '../../assets/search.png'
import i18n from '../../utils/i18n'
import { HeaderDiv, HeaderMobileDiv, HeaderMobilePanel, HeaderSearchPanel, HeaderVersionPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { AppContext } from '../../contexts/providers/index'
import { AppDispatch } from '../../contexts/providers/reducer'

const menus = [
  {
    name: i18n.t('navbar.wallet'),
    url: 'https://github.com/nervosnetwork/neuron',
  },
  {
    name: i18n.t('navbar.charts'),
    url: '/charts',
  },
]

const NORMAL_HEIGHT = 42
const SEARCH_HEIGHT = 95

const handleVersion = (appContext: any) => {
  if (appContext.nodeVersion && appContext.nodeVersion.indexOf('(') !== -1) {
    return `v${appContext.nodeVersion.slice(0, appContext.nodeVersion.indexOf('('))}`
  }
  return appContext.nodeVersion
}

export default ({ dispatch }: { dispatch: AppDispatch }) => {
  const [height, setHeight] = useState(NORMAL_HEIGHT)
  const appContext = useContext(AppContext)
  const { haveSearchBar } = appContext.header

  useEffect(() => {
    setHeight(NORMAL_HEIGHT)
  }, [setHeight])

  if (isMobile()) {
    return (
      <>
        <HeaderMobilePanel height={height}>
          <HeaderMobileDiv>
            <Link to="/" className="header__logo">
              <img className="header__logo__img" src={logoIcon} alt="logo" />
            </Link>
            <div className="header__menus">
              <a className="header__menus__item" href={menus[0].url} target="_blank" rel="noopener noreferrer">
                {menus[0].name}
              </a>
              <Link className="header__menus__item" to={menus[1].url}>
                {menus[1].name}
              </Link>
            </div>
            {haveSearchBar && (
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
            <HeaderVersionPanel>{handleVersion(appContext)}</HeaderVersionPanel>
          </HeaderMobileDiv>
          <HeaderSearchPanel>{haveSearchBar && <Search dispatch={dispatch} />}</HeaderSearchPanel>
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
        <div className="header__menus">
          <a className="header__menus__item" href={menus[0].url} target="_blank" rel="noopener noreferrer">
            {menus[0].name}
          </a>
          <Link className="header__menus__item" to={menus[1].url}>
            {menus[1].name}
          </Link>
        </div>
        {haveSearchBar && (
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
        <HeaderVersionPanel>{handleVersion(appContext)}</HeaderVersionPanel>
      </HeaderDiv>
    </>
  )
}
