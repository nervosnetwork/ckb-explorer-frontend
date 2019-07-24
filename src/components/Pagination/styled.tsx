import styled from 'styled-components'

export const PaginationPanel = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  flex-direction: row;
`

export const PaginationLeftItem = styled.div`
  display: flex;
  width: 65%;
  height: 80px;
  background: white;
  font-size: 16px;
  text-align: center;
  color: #000000;
  line-height: 40px;
  border: none;

  > button {
    font-size: 16px;
    height: 40px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    > img {
      width: 12px;
      height: 20px;
    }
  }

  .first {
    width: 90px;
    margin-top: 20px;
    margin-left: 134px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '#000000' : '#3cc68a')};
    cursor: ${(props: { isFirstPage: boolean; isLastPage: boolean }) =>
      props.isFirstPage ? 'not-allowed' : 'pointer'};
  }

  .leftImage {
    width: 30px;
    margin-left: 20px;
    margin-top: 20px;
    cursor: ${(props: { isFirstPage: boolean; isLastPage: boolean }) =>
      props.isFirstPage ? 'not-allowed' : 'pointer'};
  }

  .middleLabel {
    width: 180px;
    height: 40px;
    background: #f5f5f5;
    border-radius: 6px;
    margin-left: 20px;
    margin-top: 20px;
  }

  .rightImage {
    width: 30px;
    margin-left: 20px;
    margin-top: 20px;
    cursor: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'not-allowed' : 'pointer')};
  }

  .last {
    width: 90px;
    margin-top: 20px;
    margin-left: 20px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '#000000' : '#3cc68a')};
    cursor: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'not-allowed' : 'pointer')};
  }

  @media (max-width: 700px) {
    width: 60%;
    height: 50px;

    > button {
      font-size: 8px;
      height: 20px;
      border-radius: 3px;
      > img {
        width: 6px;
        height: 10px;
      }
    }

    > input {
      order: 2;
    }

    .leftImage {
      width: 16px;
      margin-top: 15px;
      margin-left: 20px;
      order: 0;
    }

    .first {
      display: none;
    }

    .last {
      display: none;
    }

    .middleLabel {
      line-height: 16px;
      font-size: 12px;
      background: #ffffff;
      width: auto;
      height: 16px;
      margin-top: 17px;
      margin-left: 10px;
      order: 1;
    }

    .rightImage {
      width: 16px;
      margin-top: 15px;
      margin-left: 10px;
      order: 0;
    }
  }
`

export const PaginationRightItem = styled.div`
  flex-direction: row-reverse;
  display: flex;
  width: 35%;
  height: 80px;
  background: white;
  font-size: 16px;
  text-align: center;
  color: #000000;
  line-height: 40px;
  border: none;

  > input {
    width: 120px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    font-size: 16px;
    margin-top: 20px;
    margin-right: 20px;
    @media (max-width: 700px) {
      width: 60px;
      height: 20px;
      margin-top: 15px;
      margin-right: 10px;
      font-size: 12px;
      border-radius: 3px;
    }
  }

  @media (max-width: 700px) {
    width: 40%;
    height: 50px;
  }

  > button {
    font-size: 16px;
    height: 40px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    > img {
      width: 12px;
      height: 20px;
    }
    @media (max-width: 700px) {
      height: 20px;
      border-radius: 3px;
    }
  }

  .goto {
    width: 90px;
    margin-top: 20px;
    margin-right: 80px;
    @media (max-width: 700px) {
      width: 40px;
      margin-top: 15px;
      margin-right: 20px;
      font-size: 12px;
    }
  }

  .page {
    width: 42px;
    height: 17px;
    font-family: Montserrat;
    font-size: 16px;
    line-height: 80px;
    margin-right: 20px;
    @media (max-width: 700px) {
      display: none;
    }
  }
`
