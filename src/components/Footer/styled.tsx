import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const FooterPanel = styled.div`
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${variables.mobileBreakPoint}) {
    align-items: flex-start;
  }

  .footerCopyright {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 12px;
    color: #acacac;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin: 0 0 20px 20px;
      flex-direction: column;
    }
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const FooterMenuPanel = styled.div`
  overflow: hidden;
  margin: 44px auto 52px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 280px;

  @media (max-width: ${variables.xxlBreakPoint}) {
    gap: 200px;
  }

  @media (max-width: ${variables.largeBreakPoint}) {
    gap: 100px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 50px;
    margin: 32px 20px;
  }

  .footerFoundation {
    display: flex;
    flex-direction: column;
  }

  .footerDeveloper {
    display: flex;
    flex-direction: column;
  }

  .footerCommunity {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 20px 32px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      grid-template-columns: repeat(4, max-content);
      gap: 32px;
    }
  }

  .footerTitle {
    font-size: 28px;
    font-weight: bold;
    color: #fff;

    @media (max-width: ${variables.mobileBreakPoint}) {
      font-size: 26px;
    }
  }
`

export const FooterItemPanel = styled.a`
  font-size: 18px;
  color: #acacac;
  height: 23px;
  margin: 8px 0;
`

export const FooterImageItemPanel = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #acacac;

  > svg {
    width: 35px;
    height: 35px;
  }

  > span {
    font-size: 12px;
  }

  &:hover {
    color: ${props => props.theme.primary};

    & > svg {
      /* stylelint-disable-next-line selector-class-pattern */
      .app-icon {
        fill: ${props => props.theme.primary};
      }
    }
  }
`
