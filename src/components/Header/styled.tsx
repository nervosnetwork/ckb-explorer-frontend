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

  @media (max-width: 900px) {
    padding: 0px 30px;
  }

  @media (max-width: 800px) {
    padding: 0px 24px;
  }

  @media (max-width: 750px) {
    padding: 0px 30px;
  }

  .header__logo {
    display: flex;
    align-items: center;
    margin-top: 2px;
    .header__logo__img {
      width: 116px;
      height: 20px;
    }
  }
`

export const HeaderMenuPanel = styled.div`
  display: flex;
  align-items: center;

  .header__menus__item {
    font-weight: normal;
    color: white;
    display: flex;
    align-items: center;
    padding-left: 60px;
    font-size: 14px;
    font-weight: regular;

    @media (max-width: 1920px) {
      padding-left: 40px;
    }

    @media (max-width: 1440px) {
      padding-left: 24px;
    }

    @media (max-width: 900px) {
      padding-left: 16px;
    }

    @media (max-width: 750px) {
      padding-left: 0px;
    }

    &:hover {
      font-weight: medium;
      color: #3cc68a;
    }
  }
`

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;

  @media (max-width: 1920px) {
    margin-right: 40px;
  }

  @media (max-width: 1440px) {
    margin-right: 24px;
  }

  .header__search__component {
    display: flex;
    align-items: center;
    height: 38px;
    width: 361px;
  }
`

export const HeaderSearchBarPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
  > img {
    width: 18px;
    height: 18px;
  }
`

export const HeaderBlockchainPanel = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-top: 1px;
  margin-right: 60px;
  padding: 10px 0;

  @media (max-width: 1920px) {
    margin-right: 40px;
  }

  @media (max-width: 1440px) {
    margin-right: 24px;
  }

  @media (max-width: 750px) {
    margin-right: 0px;
  }

  color: ${props => props.theme.secondary};

  .header__blockchain__flag {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .header__blockchain__content_panel {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header__blockchain__content {
      height: 14px;
      font-size: 14px;
      cursor: pointer;
    }

    img {
      width: 7.9px;
      height: 4.7px;
      margin-top: 10px;
      margin-left: 8px;
    }
  }

  .header__blockchain__node__version {
    font-size: 8px;
    margin-top: 2px;
    cursor: pointer;
  }
`

export const HeaderLanguagePanel = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: ${(props: { theme: any; showLanguage: boolean }) => (props.showLanguage ? props.theme.secondary : 'white')};
  padding: 10px 0;
  margin-bottom: 4px;

  .header__language__flag {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .header__language__content_panel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    .header__language__content {
      font-size: 14px;
      letter-spacing: 1px;
    }

    img {
      width: 7.9px;
      height: 4.7px;
      margin-top: 3px;
      margin-left: 8px;
    }
  }
`

export const HeaderWalletsPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 0;

  .header__wallets_content {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    margin-left: 60px;

    @media (max-width: 1920px) {
      margin-left: 40px;
    }

    @media (max-width: 1440px) {
      margin-left: 24px;
    }

    @media (max-width: 750px) {
      margin-left: 0px;
    }

    > div {
      font-size: 14px;
      letter-spacing: 1px;
      color: ${(props: { showWallets: boolean; theme: any }) => (props.showWallets ? props.theme.primary : 'white')};
    }

    > img {
      width: 7.9px;
      height: 4.7px;
      margin-top: 3px;
      margin-left: 8px;
    }
  }
`

export const HeaderEmptyPanel = styled.div`
  flex: 1;
`

export const HeaderMobileMenuPanel = styled.div`
  > img {
    width: 18px;
    height: 18px;
  }
`
