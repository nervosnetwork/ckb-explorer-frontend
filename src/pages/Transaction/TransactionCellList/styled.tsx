import styled from 'styled-components'

export const TransactionCellListTitlePanel = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    display: none;
  }

  .transaction__cell_list_titles {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    color: #000000;

    > span {
      flex: 0.333;
      text-align: center;
      height: 24px;
    }
  }

  &:after {
    content: '';
    background: #e2e2e2;
    height: 1px;
    margin-top: 20px;

    @media (-webkit-min-device-pixel-ratio: 2) {
      transform: scaleY(0.5);
    }
    @media (-webkit-min-device-pixel-ratio: 3) {
      transform: scaleY(0.33);
    }
  }
`

export const TransactionCellListPanel = styled.div`
  width: 100%;

  @media (min-width: 700px) {
    border-radius: 6px;
    box-shadow: 2px 2px 6px 0 #dfdfdf;
    background-color: #ffffff;
    margin-top: 20px;
    padding: 20px 40px 20px 40px;
  }

  @media (max-width: 700px) {
    margin-top: 5px;
  }
`
