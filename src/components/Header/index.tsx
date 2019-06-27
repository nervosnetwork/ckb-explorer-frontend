import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Search from '../Search'
import logoIcon from '../../assets/ckb_logo.png'
import SearchLogo from '../../assets/search.png'
import testnetTipImage from '../../assets/testnet_tip.png'
import i18n from '../../utils/i18n'

const HeaderDiv = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  padding: 1px 82px;
  .header__logo,
  .header__menus {
    display: flex;
    align-items: center;
  }
  .header__logo {
    .header__logo__img {
      width: 182px;
      height: auto;
    }
  }

  .header__menus {
    padding-top: 26px;
    padding-bottom: 27px;
    padding-left: 30px;
    min-height: 75px;
    .header__menus__item {
      margin-left: 34px;
      margin-right: 34px;
      font-size: 22px;
      font-weight: 900;
      line-height: 30px;
      color: #3cc68a;
      &.header__menus__item--active,&: hover {
        color: white;
      }
    }
  }
  .header__search {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .header__search__component {
      display: flex;
      align-items: center;
      height: 50px;
      width: 398px;
      min-width: 229px;
    }

    .header__testnet__panel {
      border-radius: 0 6px 6px 0;
      background-color: #3cc68a;
      margin-left: 3px;

      .header__testnet__flag {
        height: 50px;
        width: 120px;
        color: white;
        font-size: 16px;
        text-align: center;
        line-height: 50px;
      }

      &:hover .header__testnet__tip {
        visibility: visible;
      }

      .header__testnet__tip {
        width: 350px;
        height: 62px;
        position: fixed;
        z-index: 1100;
        right: 90px;
        top: 75px;
        background-image: url(${testnetTipImage});
        background-repeat: no-repeat;
        background-size: 350px 62px;
        visibility: hidden;
        color: white;
        font-size: 16px;
        font-weight: bold;
        padding-top: 3px;
        line-height: 62px;
        text-align: center;
      }
    }
  }
  a {
    text-decoration: none;
  }
`

const HeaderMobilePanel = styled.div`
  @media(min-width: 700px) {
    display: none;
  }
  height: ${(props: { height: number }) => props.height}px
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  padding: 1px 20px;
`

const HeaderMobileDiv = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;

  .header__logo {
    padding-top: 3px;
    .header__logo__img {
      width: 64px;
      height: auto;
    }
  }

  .header__menus {
    padding-left: 5px;
    .header__menus__item {
      margin-left: 35px;
      @media (max-width: 320px) {
        margin-left: 20px;
      }
      font-size: 14px;
      font-weight: bold;
      line-height: 100%;
      color: #3cc68a;
    }
  }

  .header__search {
    display: flex;
    flex: 1;
    height: 21px;
    justify-content: flex-end;

    .header__search__component {
      width: 29px;
      height: 21px;
      border-radius: 6px 0 0 6px;
      background: rgba(255, 255, 255, 0.2);

      .header__search__image {
        width: 14px;
        height: 14px;
        margin-left: 7.5px;
        margin-top: 3.5px;
      }
    }

    .header__testnet {
      border-radius: 0 6px 6px 0;
      background-color: #3cc68a;
      color: white;
      font-size: 8px;
      height: 21px;
      line-height: 21px;
      padding: 0 5px;
    }
  }
`

const HeaderSearchPanel = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`

const menus = [
  {
    name: i18n.t('navbar.wallet'),
    url: 'https://github.com/nervosnetwork/neuron',
  },
  {
    name: i18n.t('navbar.docs'),
    url: 'https://docs.nervos.org/',
  },
]

const NORMAL_HEIGHT = 42
const SEARCH_HEIGHT = 95

export default ({ search = true }: { search?: boolean }) => {
  const [height, setHeight] = useState(NORMAL_HEIGHT)

  useEffect(() => {
    setHeight(NORMAL_HEIGHT)
  }, [setHeight])

  return (
    <React.Fragment>
      <HeaderDiv>
        <Link to="/" className="header__logo">
          <img className="header__logo__img" src={logoIcon} alt="logo" />
        </Link>
        <div className="header__menus">
          {menus.map((menu: any) => {
            return (
              <a
                key={menu.name}
                className="header__menus__item"
                href={menu.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {menu.name}
              </a>
            )
          })}
        </div>
        {search && (
          <div className="header__search">
            <div className="header__search__component">
              <Search />
            </div>
            <div className="header__testnet__panel">
              <div className="header__testnet__flag">{i18n.t('navbar.button_text')}</div>
              <div className="header__testnet__tip">{i18n.t('navbar.button_extra')}</div>
            </div>
          </div>
        )}
      </HeaderDiv>
      <HeaderMobilePanel height={height}>
        <HeaderMobileDiv>
          <Link to="/" className="header__logo">
            <img className="header__logo__img" src={logoIcon} alt="logo" />
          </Link>
          <div className="header__menus">
            {menus.map((menu: any) => {
              return (
                <a
                  key={menu.name}
                  className="header__menus__item"
                  href={menu.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {menu.name}
                </a>
              )
            })}
          </div>
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
              <div className="header__testnet">{i18n.t('navbar.button_text')}</div>
            </div>
          )}
        </HeaderMobileDiv>
        <HeaderSearchPanel>{search && <Search />}</HeaderSearchPanel>
      </HeaderMobilePanel>
    </React.Fragment>
  )
}
