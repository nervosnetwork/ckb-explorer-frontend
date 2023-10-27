import styled from 'styled-components'

export const HeaderLanguagePanel = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: ${(props: { theme: { primary: string; secondary: string }; showLanguage: boolean }) =>
    props.showLanguage ? props.theme.secondary : 'white'};
  padding: 10px 0;
  margin-bottom: 4px;

  .headerLanguageFlag {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .headerLanguageContentPanel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    .headerLanguageContent {
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

export const MobileSubMenuPanel = styled.div<{ showSubMenu: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 22px 56px 0;

  .mobileMenusMainItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .mobileMenusMainItemContent {
    color: ${props => (props.showSubMenu ? props.theme.primary : 'white')};
  }

  .mobileMenusMainItemContentHighlight {
    color: ${props => props.theme.primary};
  }

  .mobileMenusMainItemIcon {
    width: 7.9px;
    height: 4.8px;
  }

  .blockchainMobileNodeVersion {
    font-size: 8px;
    margin-top: -5px;
    color: ${props => props.theme.primary};
  }

  .mobileMenusSubItem {
    width: 300px;
    padding: 12px 24px;
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

  .mobileMenusSubIcon {
    width: 20px;
    height: 20px;
  }

  .mobileMenusSubTitle {
    font-size: 12px;
    margin-left: 8px;
    margin-right: 16px;
  }

  .mobileMenusSubTag {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    > img {
      height: 9px;
      width: auto;
    }
  }

  .mobileMenusSubMemo {
    font-size: 12px;
    color: #888;
    width: 100%;
    margin: 22px 0 0 24px;
  }
`
