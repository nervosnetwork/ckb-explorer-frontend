import styled from 'styled-components'

export const MobileMenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 56px;
`

export const MobileMenuLink = styled.a`
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: regular;
  margin-top: 22px;
  height: 21px;

  &:hover {
    font-weight: medium;
    color: ${props => props.theme.primary};
  }
`
export const HeaderMenuPanel = styled.div`
  display: flex;
  align-items: center;

  .header__menus__item {
    color: white;
    display: flex;
    align-items: center;
    padding-left: 60px;
    font-size: 14px;
    font-weight: regular;

    @media (width <= 1920px) {
      padding-left: 40px;
    }

    @media (width <= 1440px) {
      padding-left: 24px;
    }

    @media (width <= 960px) {
      padding-left: 16px;
    }

    @media (width <= 900px) {
      padding-left: 10px;
    }

    @media (width <= 840px) {
      padding-left: 4px;
    }

    @media (width <= 750px) {
      padding-left: 0;
    }

    &:hover {
      font-weight: medium;
      color: ${props => props.theme.primary};
    }
  }
`
