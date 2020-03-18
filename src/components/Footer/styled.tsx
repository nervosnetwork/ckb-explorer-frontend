import styled from 'styled-components'

export const FooterPanel = styled.div`
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;

  .footer__copyright {
    height: 15px;
    font-size: 12px;
    color: #acacac;
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const FooterMenuPanel = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 38px auto 34px auto;
  display: flex;
  justify-content: center;

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

    > div {
      display: flex;
      flex-direction: row;
    }
  }

  .footer__title {
    font-family: SourceCodePro;
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
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
  }

  > img {
    width: 35px;
    height: 35px;
  }

  > span {
    height: 15px;
    font-size: 12px;
    margin-top: 5px;
  }
`
