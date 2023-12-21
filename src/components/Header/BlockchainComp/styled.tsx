import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

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

  @media (max-width: ${variables.xxlBreakPoint}) {
    margin-right: 24px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-right: 0;
  }

  color: ${props => props.theme.secondary};

  .headerBlockchainFlag {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .headerBlockchainContentPanel {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headerBlockchainContent {
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

  .headerBlockchainNodeVersion {
    font-size: 8px;
    margin-top: 2px;
    cursor: pointer;
    height: 12px;
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
    color: ${props => props.theme.primary};
  }

  .mobileMenusSubItem {
    width: 300px;
    padding: 12px 24px 8px;
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
