import styled, { css } from 'styled-components'

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
  padding: 1px 10vw;

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
      margin-left: 30px;
      margin-right: 30px;
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
      width: 420px;
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
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
  padding: 1px 20px;
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
      font-family: Montserrat;
      font-weight: bold;
      line-height: 100%;
      color: white;

      @media (max-width: 700px) {
        margin-left: 15px;
      }
      @media (max-width: 320px) {
        margin-left: 8px;
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
      margin: 3px 4px 0 0;
    }
  }
`

export const HeaderTestnetPanel = styled.div`
  display: flex;
  justify-content: flex-end;

  ${(props: { search: boolean }) =>
    !props.search &&
    css`
      flex: 1;
    `}

  .header__testnet__flag {
    height: 50px;
    color: white;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    letter-spacing: 2px;
    font-weight: 600;
    font-family: Montserrat;
  }

  @media (max-width: 700px) {
    display: flex;
    justify-content: flex-end;

    .header__testnet__flag {
      color: white;
      font-size: 12px;
      height: 42px;
      line-height: 42px;
      letter-spacing: normal;
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
  width: 70px;
  font-size: 12px;
  margin: 20px 0 0 4px;
  align-items: flex-end;
  height: 19px;

  @media (max-width: 700px) {
    width: 40px;
    margin: 18px 0 0 3px;
    font-size: 8px;
  }
`
