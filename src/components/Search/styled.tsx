import styled, { css } from 'styled-components'

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const SearchPanel = styled.div`
  margin: 0 auto;
  width: 100%;
  height: ${(props: { moreHeight?: boolean; hasButton?: boolean }) => (props.moreHeight ? '38px' : '30px')};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 0px solid white;
  border-radius: ${(props: { hasButton?: boolean }) => (props.hasButton ? '4px 0 0 4px' : '4px')};
  padding-right: 5px;
`

export const SearchImage = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-25px' : '8px')};
  z-index: 2;

  @media (max-width: 750px) {
    margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-25px' : '8px')};
  }

  img {
    width: 16px;
    height: 16px;
    margin: 0 auto;
  }
`

export const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 20px;
  margin-left: ${(props: { searchBarEditable: boolean; hasBorder?: boolean }) =>
    props.searchBarEditable ? '0px' : '-8px'}
  background: white;
  color: #333333;
  border: 0px solid white;
  border-radius: 4px;

  &: focus {
    color: #333333;
    outline: none;
  }

  ${(props: { hasBorder?: boolean }) =>
    props.hasBorder &&
    css`
      opacity: 1;
      border: 2px solid #606060;
      color: #888888;
      border-radius: 6px;
      margin-left: 0;
      padding-left: 10px;

      &: focus {
        color: #888888;
        outline: none;
      }
    `};

  &::placeholder {
    color: #888888;
  }

  @media (max-width: 750px) {
    font-size: 12px;
    width: 100%;
    padding-right: 16px;
  }
`

export const SearchButton = styled.div`
  width: 80px;
  height: 38px;
  border-radius: 0 4px 4px 0;
  border: solid 1px #ffffff;
  background-color: #121212;
  text-align: center;
  line-height: 34px;
  color: #ffffff;
  letter-spacing: 0.2px;
  font-size: 14px;
  cursor: pointer;
`
