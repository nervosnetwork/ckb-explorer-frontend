import styled from 'styled-components'

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
  padding: 0px 280px;

  @media (max-width: 1920px) {
    padding: 0px 140px;
  }

  @media (max-width: 1440px) {
    padding: 0px 48px;
  }

  @media (max-width: 750px) {
    padding: 0px 30px;
  }

  .header__logo {
    display: flex;
    align-items: center;
    .header__logo__img {
      width: 116px;
      height: 20px;
    }
  }

  .header__menus {
    display: flex;
    align-items: center;

    .header__menus__item {
      font-weight: normal;
      color: white;
      display: flex;
      align-items: center;
      padding-left: 60px;
      font-size: 14px;

      @media (max-width: 1920px) {
        padding-left: 40px;
      }

      @media (max-width: 1440px) {
        padding-left: 24px;
      }

      @media (max-width: 750px) {
        padding-left: 0px;
      }
    }
  }

  .header__search {
    display: flex;
    align-items: center;
    margin-right: 240px;

    @media (max-width: 1920px) {
      margin-right: 200px;
    }

    @media (max-width: 1440px) {
      margin-right: 168px;
    }

    @media (max-width: 750px) {
      margin-right: 0px;
    }

    .header__search__component {
      display: flex;
      align-items: center;
      height: 38px;
      width: 361px;
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
        font-size: 6px;
        margin-left: 3px;
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
  width: 50px;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  right: 410px;

  @media (max-width: 1920px) {
    right: 250px;
  }

  @media (max-width: 1440px) {
    right: 142px;
  }

  @media (max-width: 750px) {
    right: 0px;
  }

  color: ${(props: { showChainDropdown: boolean; theme: any }) =>
    props.showChainDropdown ? 'white' : props.theme.secondary};

  .header__blockchain__flag {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .header__blockchain__content_panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50px;
    height: 14px;

    .header__blockchain__content {
      font-size: 14px;
      letter-spacing: 1px;
      font-weight: 500px;
      cursor: pointer;
    }

    img {
      width: 7.9px;
      height: 4.7px;
      margin-top: 3px;
    }
  }

  .header__blockchain__node__version {
    font-size: 8px;
    cursor: pointer;
  }
`

export const HeaderSearchPanel = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`

export const HeaderEmptyPanel = styled.div`
  flex: 1;
`
