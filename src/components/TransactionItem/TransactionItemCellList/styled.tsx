import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;

  .transaction_item__view_all {
    font-size: 16px;
    color: ${props => props.theme.primary};
    margin-top: 20px;
    height: 20px;

    @media (width <= 750px) {
      font-size: 14px;
      margin-top: 15px;
      height: 16px;
    }
  }

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`
