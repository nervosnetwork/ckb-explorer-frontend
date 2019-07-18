import styled from 'styled-components'

export default styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  font-weight: 500;

  @media (max-width: 700px) {
    flex-direction: column;
  }

  .transaction__confirmation {
    flex: 1;
    padding-right: 20px;
    @media (max-width: 700px) {
      padding: 0px;
    }

    .transaction__confirmation_value {
      min-width: 280px;
      height: 40px;
      background: white;
      align-items: center;
      display: flex;
      color: #000000;
      border: 20px solid #f7f7f7;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      float: right;
      > span {
        width: 100%;
      }

      @media (max-width: 700px) {
        min-width: 190px;
        height: 30px;
        border: 15px solid #f7f7f7;
        border-left: 7.5px solid transparent;
        border-right: 7.5px solid transparent;
      }
    }
  }

  .transaction__capacity {
    flex: 1;
    padding-left: 20px;

    @media (max-width: 700px) {
      padding: 0px;
      margin-top: 10px;
    }

    > div {
      float: left;
    }
    .transaction__capacity_left {
      border: 20px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      border-left: 10px solid transparent;
      background: white;

      @media (max-width: 700px) {
        border: 15px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
        border-left: 7.5px solid transparent;
      }
    }
    .transaction__capacity_value {
      min-width: 220px;
      height: 40px;
      background: ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      align-items: center;
      display: flex;
      color: #ffffff;
      > span {
        width: 100%;
      }

      @media (max-width: 700px) {
        min-width: 130px;
        height: 30px;
      }
    }
    .transaction__capacity_right {
      border: 20px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
      border-right: 10px solid transparent;
      background: white;

      @media (max-width: 700px) {
        border: 15px solid ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff5757')};
        border-right: 7.5px solid transparent;
      }
    }
  }
`
