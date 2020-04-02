import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useAppState } from '../../contexts/providers'
import { ComponentActions, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import i18n, { currentLanguage, changeLanguage } from '../../utils/i18n'
import CONFIG from '../../config'
import { isMainnet } from '../../utils/chain'
import { handleVersion, LinkType, headerMenus } from '.'
import WhiteDropdownIcon from '../../assets/white_dropdown.png'
import WhiteDropUpIcon from '../../assets/white_drop_up.png'
import BlueDropUpIcon from '../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../assets/green_drop_up.png'
import Search from '../Search'
import SimpleButton from '../SimpleButton'

const MenusPanel = styled.div`
  width: 100%;
  height: 100%;
  background: #1c1c1c;
  display: flex;
  flex-direction: column;
  position: fixed;
  position: -webkit-fixed;
  z-index: 2;
  color: white;
  top: 64px;
  bottom: 0px;
  overflow: hidden;

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
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .mobile__menus__main__item__content {
    color: ${(props: { showSubMenu: boolean; theme: any }) => (props.showSubMenu ? props.theme.primary : 'white')};
  }

  .mobile__menus__main__item__content__highlight {
    color: ${props => props.theme.primary};
  }

  .mobile__menus__main__item__icon {
    width: 7.9px;
    height: 4.8px;
  }

  .blockchain__mobile__node__version {
    font-size: 8px;
    margin-top: -5px;
    color: ${props => props.theme.primary};
  }

  .mobile__menus__sub__item {
    margin-left: 24px;
    margin-top: 22px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  a {
    color: white;
    text-transform: capitalize;
  }
  a:hover {
    color: white;
  }

  .mobile__menus__sub__icon {
    width: 20px;
    height: 20px;
  }

  .mobile__menus__sub__title {
    font-size: 12px;
    margin-left: 8px;
    margin-right: 16px;
  }

  .mobile__menus__sub__tag {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    > img {
      height: 9px;
      width: auto;
    }
  }

  .mobile__menus__sub__memo {
    font-size: 12px;
    color: #888888;
    width: 100%;
    margin: 22px 0px 0px 24px;
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

const MenuItemLink = ({ menu }: { menu: any }) => {
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
  const {
    app: { nodeVersion },
  } = useAppState()
  const [showSubMenu, setShowSubMenu] = useState(false)

  const chainTypeIcon = () => {
    if (!showSubMenu) {
      return WhiteDropdownIcon
    }
    return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
  }

  return (
    <MobileSubMenuPanel showSubMenu={false}>
      <SimpleButton
        className="mobile__menus__main__item"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div className="mobile__menus__main__item__content__highlight">
          {isMainnet() ? i18n.t('navbar.mainnet') : CONFIG.TESTNET_NAME.toUpperCase()}
        </div>
        <img className="mobile__menus__main__item__icon" alt="mobile chain type icon" src={chainTypeIcon()} />
      </SimpleButton>
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
    <MobileSubMenuPanel showSubMenu={false}>
      <SimpleButton
        className="mobile__menus__main__item"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div className="mobile__menus__main__item__content">
          {currentLanguage() === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')}
        </div>
        <img
          className="mobile__menus__main__item__icon"
          alt="mobile language icon"
          src={showSubMenu ? WhiteDropUpIcon : WhiteDropdownIcon}
        />
      </SimpleButton>
      {showSubMenu && (
        <>
          <SimpleButton
            className="mobile__menus__sub__item"
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
          </SimpleButton>
          <SimpleButton
            className="mobile__menus__sub__item"
            onClick={() => {
              languageAction(dispatch)
            }}
          >
            {currentLanguage() === 'en' ? i18n.t('navbar.language_zh') : i18n.t('navbar.language_en')}
          </SimpleButton>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

const MenusComp = () => {
  const [t] = useTranslation()
  const MenuDataList = useMemo(() => headerMenus(t), [t])
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
