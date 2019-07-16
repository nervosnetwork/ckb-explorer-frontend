import styled from 'styled-components'

export const TransactiomConfirmationContent = styled.div`
  display: flex;
  flex-direction: row;
  .left {
    border: 20px solid ${'#f5f5f5'};
    background: white;
    border-left-color: transparent;
  }
  .value {
    height: 40px;
    background: ${'#f5f5f5'};
    align-items: center;
    display: flex;
  }
  .right {
    border: 20px solid ${'#f5f5f5'};
    background: white;
    border-right-color: transparent;
  }
  float: ${({ float }: { float?: string }) => float || 'left'};
`

export const TransactiomConfirmationContainer = styled.div`
  width: 100%;
  height: 40px;
  /* display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  align-items: center; */
  /* background: orange; */
  display: flex;
  flex-direction: row;
  align-items: center;
  /* margin-top: 40px; */
  /* margin-left: 40px; */

  /* &::before {
    display: block;
    content: '';
    background: gray;
    height: 100%;
    flex: 1;
  } */

  .transaction_item__confirmation {
    @media (max-width: 700px) {
      font-size: 12px;
    }

    font-size: 16px;
    color: #888888;
    flex: 1;
    /* background: red; */
    /* text-align: end; */
    padding-right: 21px;
    /* align-items: flex-end; */
    /* padding-left: auto; */
    /* float: right;
    text-align: right; */
    text-align: right;
  }
  .transaction_item__capacity {
    @media (max-width: 700px) {
      font-size: 12px;
    }

    font-size: 16px;
    color: ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff7070')};
    /* flex-direction: column; */
    /* align-items: flex-end; */
    flex: 1;
    padding-left: 21px;
  }

  /* &::after {
    display: block;
    content: '';
    background: gray;
    height: 100%;
    flex: 1;
  } */
`
