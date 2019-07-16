import styled from 'styled-components'

export default styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;

  text-align: center;
  font-size: 16px;
  font-weight: 500;

  .transaction_item__confirmation {
    flex: 1;
    padding-right: 20px;

    > div {
      float: right;
    }
    .transaction_item__confirmation_left {
      border: 20px solid #f7f7f7;
      background: white;
      border-left: 10px solid transparent;
    }
    .transaction_item__confirmation_value {
      min-width: 200px;
      height: 40px;
      background: #f7f7f7;
      align-items: center;
      display: flex;
      color: #000000;
      > span {
        width: 100%;
      }
    }
    .transaction_item__confirmation_right {
      border: 20px solid #f7f7f7;
      border-right: 10px solid transparent;
      background: white;
    }
  }

  .transaction_item__capacity {
    flex: 1;
    padding-left: 20px;

    > div {
      float: left;
    }
    .transaction_item__capacity_left {
      border: 20px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      background: white;
      border-left: 10px solid transparent;
    }
    .transaction_item__capacity_value {
      min-width: 200px;
      height: 40px;
      background: ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      align-items: center;
      display: flex;
      color: #ffffff;
      > span {
        width: 100%;
      }
    }
    .transaction_item__capacity_right {
      border: 20px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      border-right: 10px solid transparent;
      background: white;
    }
  }
`
