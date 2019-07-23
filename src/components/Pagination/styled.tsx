import styled from 'styled-components'

export const BasePagePanel = styled.div`
  display: flex;
  background: white;
  width: 100%;
  height: 80px;
  @media (max-width: 700px) {
    margin-left: 6%;
  }
`

export const PageInput = styled.input`
  width: 120px;
  height: 40px;
  border: none;
  border-radius: 6px;
  background-color: #f5f5f5;
  color: grey;
  font-size: 16px;
  margin-top: 20px;
  margin-left: 12px;
`

export const PaginationItem = styled.div`
  display: flex;
  width: 100%;
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

  .goto {
    width: 90px;
    margin-top: 20px;
    margin-left: 20px;
  }

  .page {
    width: 42px;
    height: 17px;
    font-family: Montserrat;
    font-size: 16px;
    line-height: 80px;
    margin-left: 190px;
  }

  @media (max-width: 700px) {
    width: 88%;
    height: 50px;

    > button {
      height: 20px;
      > img {
        width: 6px;
        height: 10px;
      }
    }

    .first {
      display: none;
    }

    .last {
      display: none;
    }

    .leftImage {
      width: 16px;
      margin-top: 15px;
      margin-left: 20px;
    }
  }
`
