import styled, { css } from 'styled-components'
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
  align-items: center;
  flex-wrap: wrap;
  padding: 1px 150px;

  .header__logo {
    display: flex;
    align-items: center;
    .header__logo__img {
      width: 180px;
      height: auto;
    }
  }

  .header__menus {
    display: flex;
    align-items: center;
    padding-left: 30px;
    min-height: 75px;

    .header__menus__item {
      margin-left: 35px;
      margin-right: 35px;
      font-size: 24px;
      color: white;
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
      width: 430px;
      min-width: 229px;
    }
  }
`

export const HeaderMobilePanel = styled.div`
  height: 42px;
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
      font-size: 14px;
      @media (max-width: 700px) {
        margin-left: 15px;
      }
      @media (max-width: 320px) {
        margin-left: 8px;
        font-size: 12px;
      }
      font-weight: bold;
      line-height: 100%;
      color: white;
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
  }
`

export const HeaderTestnetPanel = styled.div`
  display: flex;
  justify-content: flex-end;

  ${(props: { search: boolean }) =>
    props.search &&
    css`
      flex: 1;
    `}

  .header__testnet__flag {
    height: 50px;
    color: white;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    font-family: Montserrat-SemiBold;
  }

  &:hover .header__testnet__tip {
    visibility: visible;
  }

  .header__testnet__tip {
    width: 350px;
    height: 62px;
    position: fixed;
    z-index: 1100;
    right: 180px;
    top: 85px;
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

  @media (max-width: 700px) {
    display: flex;
    justify-content: flex-end;

    .header__testnet__flag {
      color: white;
      font-size: 12px;
      height: 42px;
      line-height: 42px;
      font-family: Montserrat-SemiBold;
    }
  }
`

export const HeaderSearchPanel = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`

export const HeaderVersionPanel = styled.div`
  color: white;
  font-size: 12px;
  margin: 20px 0 0 4px;
  align-items: flex-end;
  height: 19px;

  @media (max-width: 700px) {
    margin: 18px 0 0 3px;
    font-size: 8px;
  }
`
