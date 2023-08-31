import styled from 'styled-components'

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

export const MobileSubMenuPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 22px 56px 0;

  .mobile__menus__main__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .mobile__menus__main__item__content {
    color: ${(props: { showSubMenu: boolean; theme: any }) => (props.showSubMenu ? props.theme.primary : 'white')};
  }

  .mobile__menus__main__item__content__highlight {
    color: ${props => props.theme.primary};
  }

  .mobile__menus__main__item__icon {
    width: 7.9px;
    height: 4.8px;
  }

  .blockchain__mobile__node__version {
    font-size: 8px;
    margin-top: -5px;
    color: ${props => props.theme.primary};
  }

  .mobile__menus__sub__item {
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

  .mobile__menus__sub__icon {
    width: 20px;
    height: 20px;
  }

  .mobile__menus__sub__title {
    font-size: 12px;
    margin-left: 8px;
    margin-right: 16px;
  }

  .mobile__menus__sub__tag {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    > img {
      height: 9px;
      width: auto;
    }
  }

  .mobile__menus__sub__memo {
    font-size: 12px;
    color: #888;
    width: 100%;
    margin: 22px 0 0 24px;
  }
`
