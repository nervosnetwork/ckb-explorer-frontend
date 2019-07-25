import styled from 'styled-components'

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
  background: white;
  font-size: 16px;
  text-align: center;
  color: #000000;
  line-height: 40px;
  border: none;

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
    > img {
      width: 12px;
      height: 20px;
    }
    &:hover {
      font-weight: bold;
    }
    &:active {
      background: #3cc68a;
    }
  }

  .first {
    width: 90px;
    color: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '#888888' : '#000000')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};
  }

  .left_image {
    width: 30px;
    margin-left: 20px;
    opacity: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? '0.5' : '1')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isFirstPage ? 'none' : 'auto')};
  }

  .middle_label {
    width: 180px;
    height: 40px;
    background: #f5f5f5;
    border-radius: 6px;
    margin-left: 20px;
  }

  .right_image {
    width: 30px;
    margin-left: 20px;
    opacity: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? '0.5' : '1')};
    pointer-events: ${(props: { isFirstPage: boolean; isLastPage: boolean }) => (props.isLastPage ? 'none' : 'auto')};
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
      > img {
        width: 6px;
        height: 10px;
      }
    }

    .left_image {
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

    .middle_label {
      line-height: 16px;
      font-size: 12px;
      background: #ffffff;
      width: auto;
      height: 16px;
      margin-top: 17px;
      margin-left: 10px;
      order: 1;
    }

    .right_image {
      width: 16px;
      margin-top: 15px;
      margin-left: 10px;
      order: 0;
    }
  }
`

export const PaginationRightItem = styled.div`
  flex-direction: row;
  display: flex;
  background: white;
  font-size: 16px;
  color: #000000;
  border: none;

  @media (min-width: 700px) {
    width: 452px;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 10px 80px;
  }

  @media (max-width: 700px) {
    height: 50px;
  }

  > input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  > input[type='number'] {
    -moz-appearance: textfield;
  }

  .jump_page_input {
    width: 120px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: grey;
    font-size: 16px;
    margin-right: 20px;
    padding-left: 10px;
    &:focus + .go_to {
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
    > img {
      width: 12px;
      height: 20px;
    }
    &:active {
      background: #3cc68a;
    }
    @media (max-width: 700px) {
      height: 20px;
      border-radius: 3px;
    }
  }

  .go_to {
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
    font-family: Montserrat;
    font-size: 16px;
    margin-right: 20px;
    @media (max-width: 700px) {
      display: none;
    }
  }
`
