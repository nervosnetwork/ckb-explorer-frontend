import styled from 'styled-components'

export const FooterPanel = styled.div`
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  background-color: #000000;

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
  padding: 38px 10% 34px 10%;
  display: flex;

  .footer__foundation {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .footer__developer {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .footer__community {
    flex: 1;
    display: flex;
    flex-direction: column;

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
