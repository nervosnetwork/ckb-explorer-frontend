import styled, { css } from 'styled-components'

export const HeaderDiv = styled.div`
  width: 100%;
  min-height: 80px;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: fixed;
  position: -webkit-fixed;
  overflow: visible;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 1px 8vw;

  @media (max-width: 1440px) {
    padding: 1px 3vw;
  }

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
    padding-left: 20px;
    min-height: 75px;

    .header__menus__item {
      margin-left: 16px;
      margin-right: 16px;
      font-size: 24px;
      letter-spacing: 2px;
      font-weight: 600;
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
      width: 440px;
      min-width: 229px;
    }
  }
`

const HeaderMobileCommonPanel = styled.div`
  height: 42px;
  width: 100vw;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: fixed;
  position: -webkit-fixed;
  overflow: visible;
  top: 0;
  z-index: 10;
  padding: 1px 20px;

  @media (max-width: 400px) {
    padding: 1px 10px;
  }
`

export const HeaderMobilePanel = styled(HeaderMobileCommonPanel)`
  display: ${({ searchBarEditable }: { searchBarEditable: boolean }) => (searchBarEditable ? 'none' : 'block')};
`

export const HeaderSearchMobilePanel = styled(HeaderMobileCommonPanel)`
  display: ${({ searchBarEditable }: { searchBarEditable: boolean }) => (searchBarEditable ? 'block' : 'none')};
`

export const HeaderMobileDiv = styled.div`
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;

  .header__logo {
    height: 16px;
    .header__logo__img {
      width: 80px;
      height: 16px;
    }
  }

  .header__menus {
    padding-left: 5px;
    display: flex;
    align-items: center;

    .header__menus__item {
      margin-left: 10px;
      font-size: 14px;
      font-weight: bold;
      color: white;

      @media (max-width: 400px) {
        margin-left: 6px;
        font-size: 12px;
      }
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

      .header__search__image {
        width: 14px;
        height: 14px;
        margin-left: 7.5px;
        margin-top: 3.5px;
      }
    }

    .header__search__separate {
      align-items: center;
      height: 14px;
      width: 1px;
      background: white;
      margin: 3px 6px 0 0;
    }
  }
`

export const HeaderBlockchainPanel = styled.div`
  display: flex;
  align-items: center;
  ${(props: { search: boolean }) =>
    !props.search &&
    css`
      flex: 1;
    `}

  .header__blockchain__flag {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .header__blockchain__content {
    color: white;
    font-size: 24px;
    text-align: center;
    letter-spacing: 2px;
    font-weight: bold;
  }

  @media (max-width: 700px) {
    .header__blockchain__content {
      color: white;
      font-size: 12px;
      letter-spacing: normal;
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
  width: 85px;
  color: white;
  font-size: 12px;
  margin-right: 90px;
  display: flex;

  > div {
    margin-top: 8px;
  }

  img {
    margin: 8px 0 0 5px;
    width: 15px;
    height: 9px;
  }

  @media (max-width: 700px) {
    width: 50px;
    font-size: 8px;
    margin-right: 40px;
    > div {
      margin-top: 5px;
    }
    img {
      margin: 5px 0 0 5px;
      width: 10px;
      height: 6px;
    }
  }
`
