import styled, { css } from 'styled-components'

export const HeaderDiv = styled.div`
  width: 100%;
  min-height: 64px;
  background-color: #040607;
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
      width: 150px;
      height: auto;
    }
  }

  .header__menus {
    display: flex;
    align-items: center;
    padding-left: 20px;
    min-height: 56px;

    .header__menus__item {
      margin-left: 10px;
      margin-right: 10px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;

      > span {
        font-size: 13px;
        margin-left: 10px;
      }

      > img {
        width: 17px;
        height: 17px;
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
      height: 30px;
      width: 371px;
      min-width: 229px;

      @media (max-width: 1100px) {
        margin-right: 8vw;
      }
    }
  }
`

const HeaderMobileCommonPanel = styled.div`
  height: 42px;
  width: 100vw;
  overflow: hidden;
  background-color: #040607;
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
  padding: ${({ searchBarEditable }: { searchBarEditable: boolean }) => (searchBarEditable ? '10px 20px' : '1px 20px')};

  @media (max-width: 400px) {
    padding: ${({ searchBarEditable }: { searchBarEditable: boolean }) =>
      searchBarEditable ? '10px 10px' : '1px 10px'};
  }
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
      height: 15px;
      margin-bottom: 3px;
    }

    @media (max-width: 400px) {
      margin-bottom: 4px;
    }
  }

  .header__menus {
    padding-left: 5px;
    display: flex;
    align-items: center;

    .header__menus__item {
      margin-left: 8px;
      font-size: 10px;
      font-weight: bold;
      color: white;

      > span {
        font-size: 8px;
        margin-left: 3px;

        @media (max-width: 400px) {
          font-size: 6px;
        }
      }

      > img {
        width: 10px;
        height: 10px;

        @media (max-width: 400px) {
          width: 8px;
          height: 8px;
        }
      }

      @media (max-width: 400px) {
        margin-left: 4px;
        font-size: 8px;
      }
    }
  }

  .header__search {
    display: flex;
    align-items: center;
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
  color: ${(props: { showChainDropdown: boolean; theme: any; search: boolean }) =>
    props.showChainDropdown ? 'white' : props.theme.secondary};
  ${(props: { search: boolean }) =>
    !props.search &&
    css`
      flex: 1;
      justify-content: flex-end;
    `}

  .header__blockchain__flag {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .header__blockchain__content {
    font-size: 20px;
    text-align: center;
    letter-spacing: 1px;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    .header__blockchain__content {
      font-size: 10px;
      letter-spacing: normal;
      margin-top: 3px;
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
  width: 100px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 80px;
  display: flex;
  cursor: pointer;
  padding-left: 4px;

  > div {
    margin-top: 8px;
  }

  img {
    margin: 8px 0 0 5px;
    width: 15px;
    height: 9px;
  }

  @media (max-width: 700px) {
    width: 63px;
    font-size: 8px;
    margin-right: 40px;
    padding-left: 2px;
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
