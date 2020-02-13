import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useAppState } from '../../contexts/providers'
import { ComponentActions, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import i18n, { currentLanguage, changeLanguage } from '../../utils/i18n'
import CONFIG from '../../config'
import { isMainnet } from '../../utils/chain'
import { handleVersion, LinkType } from '.'
import WhiteDropdownIcon from '../../assets/white_dropdown.png'
import WhiteDropUpIcon from '../../assets/white_drop_up.png'
import BlueDropUpIcon from '../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../assets/green_drop_up.png'
import { isMobile } from '../../utils/screen'
import Search from '../Search'

const MenusPanel = styled.div`
  width: 100%;
  height: 100vh;
  background: #1c1c1c;
  display: flex;
  flex-direction: column;
  position: fixed;
  position: -webkit-fixed;
  z-index: 2;
  color: white;
  top: 64px;
  bottom: 0px;

  .mobile__menus {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0 56px;

    .mobile__menus__item {
      font-weight: normal;
      color: white;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: regular;
      margin-top: 22px;
      height: 21px;

      &:hover {
        font-weight: medium;
        color: #3cc68a;
      }
    }
  }
`

const MobileSubMenuPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 22px 56px 0 56px;

  .mobile__menus__main__item {
    display: flex;
    justify-content: space-between
    align-items: center;
    width: 100%;
  }

  .mobile__menus__main__item__content__highlight {
    color: ${props => props.theme.primary}
  }

  .mobile__menus__main__item__icon {
    width: 7.9px;
    height: 4.8px;
  }

  .blockchain__mobile__node__version {
    font-size: 8px;
    color: ${props => props.theme.primary}
  }

  .mobile__menus__sub__item {
    margin-left: 24px;
    margin-top: 22px;
    font-size: 12px;
  }

  a {
    color: white;
    text-transform: capitalize;
  }
  a:hover {
    color: white;
  }
`

const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin: 22px 15px;

  .header__search__component {
    display: flex;
    align-items: center;
    height: 38px;
    width: 100%;
  }
`

interface MenuType {
  type: LinkType
  name: string
  url: string
}

const MenuItemLink = ({ menu }: { menu: MenuType }) => {
  return (
    <a
      className="mobile__menus__item"
      href={menu.url}
      target={menu.type === LinkType.Inner ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {menu.name}
    </a>
  )
}

const BlockchainMenu = () => {
  const { app } = useAppState()
  const { nodeVersion } = app
  const [showSubMenu, setShowSubMenu] = useState(false)

  const chainTypeIcon = () => {
    if (!showSubMenu) {
      return WhiteDropdownIcon
    }
    return isMobile() ? GreenDropUpIcon : BlueDropUpIcon
  }

  return (
    <MobileSubMenuPanel>
      <div className="mobile__menus__main__item">
        <div className="mobile__menus__main__item__content__highlight">
          {isMainnet() ? i18n.t('navbar.mainnet') : CONFIG.TESTNET_NAME.toUpperCase()}
        </div>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            setShowSubMenu(!showSubMenu)
          }}
        >
          <img className="mobile__menus__main__item__icon" alt="mobile chain type icon" src={chainTypeIcon()} />
        </div>
      </div>
      <div className="blockchain__mobile__node__version">{handleVersion(nodeVersion)}</div>
      {showSubMenu && (
        <>
          <a className="mobile__menus__sub__item" href={CONFIG.MAINNET_URL}>
            {i18n.t('blockchain.mainnet')}
          </a>
          <a className="mobile__menus__sub__item" href={`${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`}>
            {`${CONFIG.TESTNET_NAME} ${i18n.t('blockchain.testnet')}`}
          </a>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

const languageAction = (dispatch: AppDispatch) => {
  changeLanguage(currentLanguage() === 'en' ? 'zh' : 'en')
  dispatch({
    type: AppActions.UpdateAppLanguage,
    payload: {
      language: currentLanguage() === 'en' ? 'zh' : 'en',
    },
  })
  dispatch({
    type: ComponentActions.UpdateHeaderMobileMenuVisible,
    payload: {
      mobileMenuVisible: false,
    },
  })
}

const LanguageMenu = () => {
  const dispatch = useDispatch()
  const [showSubMenu, setShowSubMenu] = useState(false)

  return (
    <MobileSubMenuPanel>
      <div className="mobile__menus__main__item">
        <div className="mobile__menus__main__item__content">
          {currentLanguage() === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')}
        </div>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            setShowSubMenu(!showSubMenu)
          }}
        >
          <img
            className="mobile__menus__main__item__icon"
            alt="mobile language icon"
            src={showSubMenu ? WhiteDropUpIcon : WhiteDropdownIcon}
          />
        </div>
      </div>
      {showSubMenu && (
        <>
          <div
            className="mobile__menus__sub__item"
            role="button"
            tabIndex={-1}
            onKeyDown={() => {}}
            onClick={() => {
              dispatch({
                type: ComponentActions.UpdateHeaderMobileMenuVisible,
                payload: {
                  mobileMenuVisible: false,
                },
              })
            }}
          >
            {currentLanguage() === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')}
          </div>
          <div
            className="mobile__menus__sub__item"
            role="button"
            tabIndex={-1}
            onKeyDown={() => {}}
            onClick={() => {
              languageAction(dispatch)
            }}
          >
            {currentLanguage() === 'en' ? i18n.t('navbar.language_zh') : i18n.t('navbar.language_en')}
          </div>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

const MenusComp = () => {
  const [t] = useTranslation()
  const MenuDataList = useMemo(() => {
    return [
      {
        type: LinkType.Inner,
        name: t('navbar.explorer'),
        url: '/',
      },
      {
        type: LinkType.Inner,
        name: t('navbar.charts'),
        url: '/charts',
      },
      {
        type: LinkType.Inner,
        name: t('navbar.nervos_dao'),
        url: '/nervosdao',
      },
    ]
  }, [t])
  return (
    <div className="mobile__menus">
      {MenuDataList.map(menu => {
        return <MenuItemLink menu={menu} key={menu.name} />
      })}
    </div>
  )
}

export default () => {
  return (
    <MenusPanel>
      <MenusComp />
      <BlockchainMenu />
      <LanguageMenu />
      <HeaderSearchPanel>
        <div className="header__search__component">
          <Search />
        </div>
      </HeaderSearchPanel>
    </MenusPanel>
  )
}
