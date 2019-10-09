import styled from 'styled-components'
import LeftBlack from '../../assets/pagination_black_left.png'
import LeftWhite from '../../assets/pagination_white_left.png'
import LeftGreen from '../../assets/pagination_green_left.png'
import RightBlack from '../../assets/pagination_black_right.png'
import RightWhite from '../../assets/pagination_white_right.png'
import RightGreen from '../../assets/pagination_green_right.png'

export const PaginationPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  background: white;
  flex-direction: row;
  justify-content: center;

  @media (min-width: 700px) {
    padding-bottom: 10px;
    padding-top: 10px;
  }

  @media (max-width: 700px) {
    height: 50px;
    margin-bottom: 20px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }
`

export const PaginationLeftItem = styled.div`
  display: flex;
  flex: 1;
  font-size: 16px;
  text-align: center;
  color: #000000;
  line-height: 40px;

  @media (min-width: 700px) {
    align-items: center;
    justify-content: center;
  }

  > button {
    font-size: 16px;
    height: 40px;
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

  .first {
    width: 90px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '#888888' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};
  }

  .left__button {
    width: 30px;
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

  .middle__label {
    height: 40px;
    background: #f5f5f5;
    border-radius: 6px;
    margin-left: 20px;
    padding: 0 6px;
  }

  .right__button {
    width: 30px;
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

  .last {
    width: 90px;
    margin-left: 20px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '#888888' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};
  }

  @media (max-width: 700px) {
    width: 60%;
    height: 50px;

    > button {
      font-size: 8px;
      height: 20px;
      border-radius: 3px;
    }

    .left__button {
      width: 16px;
      margin-top: 15px;
      margin-left: 20px;
      background-image: url(${LeftGreen});
      background-position: center;
      background-size: 6px 10px;
      background-repeat: no-repeat;
      order: 0;
    }

    .first {
      display: none;
    }

    .last {
      display: none;
    }

    .middle__label {
      line-height: 16px;
      font-size: 12px;
      background: #ffffff;
      width: auto;
      height: 16px;
      margin-top: 17px;
      margin-left: 10px;
      order: 1;
    }

    .right__button {
      width: 16px;
      margin-top: 15px;
      margin-left: 10px;
      background-image: url(${RightGreen});
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
  font-size: 16px;
  color: #000000;

  @media (min-width: 700px) {
    width: 452px;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 10px 80px;
  }

  @media (max-width: 700px) {
    height: 50px;
  }

  .input__page {
    width: 120px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    outline: none;
    font-size: 16px;
    margin-right: 20px;
    padding-left: 10px;
    &:focus + .goto__page {
      font-weight: 600;
    }

    @media (max-width: 700px) {
      width: 60px;
      height: 20px;
      margin-top: 15px;
      margin-right: 10px;
      font-size: 12px;
      border-radius: 3px;
    }
  }

  > button {
    font-size: 16px;
    height: 40px;
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
    @media (max-width: 700px) {
      height: 20px;
      border-radius: 3px;
    }
  }

  .goto__page {
    width: 90px;
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
    font-size: 16px;
    margin-right: 20px;
    @media (max-width: 700px) {
      display: none;
    }
  }
`
