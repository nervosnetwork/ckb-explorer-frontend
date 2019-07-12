import styled from 'styled-components'
import testnetTipImage from '../../assets/testnet_tip.png'

export const HeaderDiv = styled.div`
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
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
    padding-left: 30px;
    min-height: 75px;
    .header__menus__item {
      margin-left: 34px;
      margin-right: 34px;
      font-size: 22px;
      font-weight: 450;
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

export const HeaderMobilePanel = styled.div`
  height: ${(props: { height: number }) => props.height}px
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
  padding: 1px 20px;
`

export const HeaderMobileDiv = styled.div`
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

export const HeaderSearchPanel = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`
