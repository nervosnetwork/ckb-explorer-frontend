import styled from 'styled-components'

export const FooterPanel = styled.div`
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 750px) {
    align-items: flex-start;
  }

  .footer__copyright {
    height: 15px;
    font-size: 12px;
    color: #acacac;
    margin-bottom: 28px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    @media (max-width: 750px) {
      margin-left: 30px;
      flex-direction: column;
      justify-content: center;
    }
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const FooterMenuPanel = styled.div`
  overflow: hidden;
  margin: 38px auto 34px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 30px;
  }

  .footer__foundation {
    display: flex;
    flex-direction: column;
  }

  .footer__developer {
    display: flex;
    flex-direction: column;
    margin-left: 280px;

    @media (max-width: 1980px) {
      margin-left: 178px;
    }

    @media (max-width: 1440px) {
      margin-left: 138px;
    }

    @media (max-width: 1200px) {
      margin-left: 78px;
    }

    @media (max-width: 750px) {
      margin-left: 0px;
      margin-top: 30px;
    }
  }

  .footer__community {
    display: flex;
    flex-direction: column;
    margin-left: 280px;

    @media (max-width: 1980px) {
      margin-left: 178px;
    }

    @media (max-width: 1440px) {
      margin-left: 138px;
    }

    @media (max-width: 1200px) {
      margin-left: 78px;
    }

    @media (max-width: 750px) {
      margin-left: 0px;
      margin-top: 30px;
    }

    > div {
      display: flex;
      flex-direction: row;

      @media (max-width: 750px) {
        flex-wrap: wrap;
        margin-right: 100px;
      }
    }
  }

  .footer__title {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;

    @media (max-width: 750px) {
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
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: #acacac;

  &:hover {
    color: ${props => props.theme.primary};

    & > svg {
      .app-icon {
        fill: ${props => props.theme.primary};
      }
    }
  }

  > svg {
    width: 35px;
    height: 35px;
  }

  > span {
    height: 15px;
    font-size: 12px;
    margin-top: 5px;
  }
`
