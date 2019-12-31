import styled from 'styled-components'

export const TransactionListPanel = styled.div`
  width: 100%;

  @media (min-width: 700px) {
    margin-top: 25px;
    margin-bottom: 40px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.21);
  }

  @media (max-width: 700px) {
    margin-top: 0px;
    padding: 0px 20px 0px 20px;

    .transaction__green__background {
      margin-left: -20px;
      height: 61px;
      width: calc(100% + 40px);
      background-color: ${props => props.theme.primary};
      z-index: 1;
    }
  }

  .transaction_list__pagination {
    @media (max-width: 700px) {
      margin-top: 5px;
    }
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 700px) {
    font-size: 26px;
  }

  &:after {
    content: '';
    background: ${props => props.theme.primary};
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;

    @media (max-width: 700px) {
      width: 80px;
    }
  }
`

export const ContentTable = styled.div`
  margin: 0 auto;
  width: 100%;
  z-index: 2;

  .transaction__green__background {
    margin-left: -20px;
    height: 61px;
    width: calc(100% + 40px);
    background-color: ${props => props.theme.primary};
    z-index: 1;
  }

  .transaction__panel {
    margin-top: -41px;
    z-index: 2;
  }
`

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;

  span {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`

export const TransactionCapacityContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 700px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  :after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

export const TransactionCapacityPanel = styled.div`
  display: flex;
  justify-content: center;
`
