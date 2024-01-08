import styled from 'styled-components'

const MARGIN_PER_ITEM_JUSTIFY = (56 - 8) / (1440 - 1024)

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

  .headerMenusItem {
    color: white;
    display: flex;
    align-items: center;
    margin-right: 56px;
    font-size: 14px;
    font-weight: regular;

    @media (max-width: 1505px) {
      margin-right: calc(56px - (1505px - 100vw) / 8);
    }

    @media (max-width: 1200px) {
      margin-right: 20px;
    }

    @media (min-width: 1024px) and (max-width: 1044px) {
      margin-right: calc(56px - ((1440px - 100vw) * ${MARGIN_PER_ITEM_JUSTIFY}));
    }

    &:hover {
      font-weight: medium;
      color: ${props => props.theme.primary};
    }
  }
`
