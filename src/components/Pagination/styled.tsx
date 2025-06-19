import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const PaginationPanel = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  background: white;
  flex-direction: row;
  justify-content: center;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 12%);
`

export const PaginationLeftItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 3;
  font-size: 14px;
  text-align: center;
  color: #000;
  padding-left: 20px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding-left: 0;
    justify-content: flex-start;
  }

  .paginationFirstButton {
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
      background: #ddd;
    }

    @media (max-width: ${variables.mobileBreakPoint}) {
      display: none;
    }
  }

  .paginationLeftButton {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: #f5f5f5;
    border-radius: 6px;
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};

    &:hover {
      background: #ddd;
    }

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-left: 10px;
    }

    > img {
      width: 9px;
      height: 15px;
    }
  }

  .paginationMiddleLabel {
    height: 30px;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 6px;
    text-align: center;
    font-size: 12px;
    padding: 0 12px;
    margin-left: 20px;
    white-space: nowrap;

    @media (max-width: ${variables.mobileBreakPoint}) {
      background: white;
      border-radius: 0;
      margin-left: 10px;
      padding: 0;
    }

    img {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }

  .paginationRightButton {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    background: #f5f5f5;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 6px;
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-left: 10px;
    }

    &:hover {
      background: #ddd;
    }

    > img {
      width: 9px;
      height: 15px;
    }
  }

  .paginationLastButton {
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
      background: #ddd;
    }

    @media (max-width: ${variables.mobileBreakPoint}) {
      display: none;
    }
  }
`

export const PaginationRightItem = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  font-size: 14px;
  color: #000;
  padding-right: 20px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding-right: 0;
    justify-content: flex-end;
  }

  .paginationInputPage {
    width: 120px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    outline: none;
    margin-right: 20px;
    padding-left: 10px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      width: 60px;
      margin-right: 0;
      padding-left: 8px;
      font-size: 12px;
    }
  }

  .paginationPageLabel {
    margin-right: 20px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      display: none;
    }
  }

  .paginationGotoPage {
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
      background: #ddd;
    }

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-left: 10px;
      margin-right: 10px;
      font-size: 12px;
    }
  }
`
