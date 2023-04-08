import styled from 'styled-components'

export const PaginationPanel = styled.div`
  display: flex;
  flex: 6;
  width: 100%;
  height: 50px;
  background: white;
  flex-direction: row;
  justify-content: center;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  background-color: #ffffff;

  @media (max-width: 750px) {
    margin-bottom: 30px;
  }
`

export const PaginationLeftItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 3;
  font-size: 14px;
  text-align: center;
  color: #000000;
  padding-left: 20px;

  @media (max-width: 750px) {
    padding-left: 0px;
    justify-content: flex-start;
  }

  .pagination__first__button {
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    letter-spacing: 1px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '#969696' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};

    &:hover {
      background: #dddddd;
    }

    @media (max-width: 750px) {
      display: none;
    }
  }

  .pagination__left__button {
    margin-left: 20px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: #f5f5f5;
    border-radius: 6px;
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};

    &:hover {
      background: #dddddd;
    }

    @media (max-width: 750px) {
      margin-left: 10px;
    }

    > img {
      width: 9px;
      height: 15px;
    }
  }

  .pagination__middle__label {
    height: 30px;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 6px;
    text-align: center;
    font-size: 12px;
    padding: 0 12px;
    margin-left: 20px;

    @media (max-width: 750px) {
      background: white;
      border-radius: 0px;
      margin-left: 10px;
      padding: 0;
    }

    img {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }

  .pagination__right__button {
    margin-left: 20px;
    background: #f5f5f5;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 6px;
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};

    @media (max-width: 750px) {
      margin-left: 10px;
    }

    &:hover {
      background: #dddddd;
    }

    > img {
      width: 9px;
      height: 15px;
    }
  }

  .pagination__last__button {
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    letter-spacing: 1px;
    margin-left: 20px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '#969696' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};

    &:hover {
      background: #dddddd;
    }

    @media (max-width: 750px) {
      display: none;
    }
  }
`

export const PaginationRightItem = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  font-size: 14px;
  color: #000000;
  padding-right: 20px;

  @media (max-width: 750px) {
    padding-right: 0px;
    justify-content: flex-end;
  }

  .pagination__input__page {
    width: 120px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    outline: none;
    margin-right: 20px;
    padding-left: 10px;

    @media (max-width: 750px) {
      width: 60px;
      margin-right: 0px;
      padding-left: 8px;
      font-size: 12px;
    }
  }

  .pagination__page__label {
    margin-right: 20px;

    @media (max-width: 750px) {
      display: none;
    }
  }

  .pagination__goto__page {
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    letter-spacing: 1px;
    margin-left: 20px;

    &:hover {
      background: #dddddd;
    }

    @media (max-width: 750px) {
      margin: 0 10px;
      font-size: 12px;
    }
  }
`
