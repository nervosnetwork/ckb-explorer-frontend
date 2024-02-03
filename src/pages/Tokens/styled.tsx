import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const TokensPanel = styled.div`
  margin-top: 40px;
  margin-bottom: 60px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .tokensTitlePanel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-bottom: 10px;
    }

    > span {
      color: #000;
      font-size: 24px;
      font-weight: bold;
    }

    > a {
      font-size: 14px;
      color: ${props => props.theme.primary};
    }
  }
`

export const TokensContentEmpty = styled.div`
  height: 100px;
  line-height: 100px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 12%);
  background-color: #fff;
  text-align: center;
  font-size: 16px;
  margin-top: 4px;
  margin-bottom: 180px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    font-size: 14px;
    border-radius: 6px;
    margin-bottom: 160px;
  }
`

export const TokensLoadingPanel = styled.div`
  width: 100%;
  text-align: center;

  @media (max-width: ${variables.mobileBreakPoint}) {
    height: 100px;
    line-height: 100px;
    margin-bottom: 160px;
    width: 100%;
    text-align: center;
    margin-top: 4px;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 2px 6px 0 rgb(0 0 0 / 12%);
    background-color: #fff;
  }
`
