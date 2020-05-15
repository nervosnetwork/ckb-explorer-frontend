import styled from 'styled-components'
import LeftBlack from '../../assets/pagination_black_left.png'
import LeftWhite from '../../assets/pagination_white_left.png'
import LeftGreen from '../../assets/pagination_green_left.png'
import LeftBlue from '../../assets/pagination_blue_left.png'
import RightBlack from '../../assets/pagination_black_right.png'
import RightWhite from '../../assets/pagination_white_right.png'
import RightGreen from '../../assets/pagination_green_right.png'
import RightBlue from '../../assets/pagination_blue_right.png'
import { isMainnet } from '../../utils/chain'

export const PaginationPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  background: white;
  flex-direction: row;
  justify-content: center;

  @media (min-width: 750px) {
    padding-bottom: 10px;
    padding-top: 10px;
  }

  @media (max-width: 750px) {
    height: 50px;
    margin-bottom: 20px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }
`

export const PaginationLeftItem = styled.div`
  display: flex;
  align-items: center;
  flex: 3;
  font-size: 14px;
  text-align: center;
  color: #000000;
  padding-left: 20px;

  @media (min-width: 750px) {
    justify-content: center;
  }

  > button {
    height: 40px;
    padding: 0 16px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    letter-spacing: 1px;
    &:hover {
      font-weight: 600;
    }
    &:active {
      background: ${props => props.theme.primary};
      color: white;
    }
  }

  .pagination__first {
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '#888888' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};
  }

  .pagination__left__button {
    margin-left: 20px;
    background-image: url(${LeftBlack});
    background-position: center;
    background-size: 12px 20px;
    background-repeat: no-repeat;
    opacity: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '0.5' : '1')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};
    &:active {
      background-image: url(${LeftWhite});
      background-repeat: no-repeat;
      background-position: center;
      background-size: 12px 20px;
    }
  }

  .pagination__middle__label {
    height: 40px;
    background: #f5f5f5;
    border-radius: 6px;
    margin-left: 20px;
    padding: 0 12px;
    line-height: 40px;
  }

  .pagination__right__button {
    margin-left: 20px;
    background-image: url(${RightBlack});
    background-position: center;
    background-size: 12px 20px;
    background-repeat: no-repeat;
    opacity: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '0.5' : '1')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};
    &:active {
      background-image: url(${RightWhite});
      background-repeat: no-repeat;
      background-position: center;
      background-size: 12px 20px;
    }
  }

  .pagination__last {
    margin-left: 20px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '#888888' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};
  }

  @media (max-width: 750px) {
    width: 60%;
    height: 50px;
    padding-left: 20px;

    > button {
      font-size: 8px;
      padding: 0 5px;
      height: 20px;
      border-radius: 3px;
    }

    .pagination__left__button {
      background-image: url(${isMainnet() ? LeftGreen : LeftBlue});
      background-position: center;
      background-size: 6px 10px;
      background-repeat: no-repeat;
      order: 0;
    }

    .pagination__first {
      display: none;
    }

    .pagination__last {
      display: none;
    }

    .pagination__middle__label {
      line-height: 16px;
      font-size: 12px;
      background: #ffffff;
      width: auto;
      height: 16px;
      margin-left: 10px;
      order: 1;
    }

    .pagination__right__button {
      margin-left: 10px;
      background-image: url(${isMainnet() ? RightGreen : RightBlue});
      background-position: center;
      background-size: 6px 10px;
      background-repeat: no-repeat;
      order: 0;
    }
  }
`

export const PaginationRightItem = styled.div`
  flex-direction: row;
  display: flex;
  font-size: 14px;
  color: #000000;
  padding-right: 20px;

  @media (min-width: 750px) {
    flex: 2;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0px 10px 30px;
  }

  @media (max-width: 750px) {
    height: 50px;
  }

  .pagination__input__page {
    width: 120px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    outline: none;
    margin-right: 20px;
    padding-left: 10px;
    &:focus + .pagination__goto__page {
      font-weight: 600;
    }

    @media (max-width: 750px) {
      width: 60px;
      height: 20px;
      margin-top: 15px;
      margin-right: 10px;
      font-size: 12px;
      border-radius: 3px;
    }
  }

  > button {
    height: 40px;
    padding: 0 12px;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #f5f5f5;
    letter-spacing: 1px;
    &:active {
      background: ${props => props.theme.primary};
      color: white;
    }
    @media (max-width: 750px) {
      height: 20px;
      padding: 0 5px;
      border-radius: 3px;
    }
  }

  .pagination__goto__page {
    @media (max-width: 750px) {
      width: 40px;
      margin-top: 15px;
      margin-right: 20px;
      font-size: 12px;
    }
  }

  .pagination__page {
    margin-right: 20px;
    @media (max-width: 750px) {
      display: none;
    }
  }
`
