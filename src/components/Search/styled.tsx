import styled, { css } from 'styled-components'

export const SearchPanel = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 50px;
  position: relative;
  @media (max-width: 700px) {
    height: 42px;
  }
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .search__icon__separate {
    align-items: center;
    height: 14px;
    width: 1px;
    background: white;
    margin: 0 0 0 8px;
  }
`

export const SearchImage = styled.div`
  display: inline-block;
  margin-left: ${(props: { greenIcon: boolean }) => (props.greenIcon ? '-45px' : '0')};
  z-index: 2;

  @media (max-width: 700px) {
    margin-left: ${(props: { greenIcon: boolean }) => (props.greenIcon ? '-25px' : '0')};
  }

  img {
    width: 32px;
    height: 32px;

    @media (max-width: 700px) {
      width: 18px;
      height: 18px;
    }
  }
`

export const SearchInputPanel = styled.input`
  z-index: 100;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 50px;
  background: rgba(255, 255, 255, 0);
  border: 0 solid #606060;
  border-radius: 0;
  color: #bababa;

  &: focus {
    color: #bababa;
    outline: none;
  }

  ${(props: { hasBorder: boolean }) =>
    props.hasBorder &&
    css`
      opacity: 1;
      border: 2px solid #606060;
      color: #666666;
      border-radius: 6px;

      &: focus {
        color: #666666;
        outline: none;
      }
    `};

  &::placeholder {
    color: #bababa;
  }

  @media (max-width: 700px) {
    font-size: 12px;
    width: 100%;
    padding-left: 10px;
    padding-right: 20px;
  }
`

export const SuggestionsPanel = styled.div`
  position: absolute;
  top: 66px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  background: #fff;
  border: 1px solid grey;
  border-radius: 1px;
`

export const SuggestionHeading = styled.div`
  color: black;
  text-align: left;
  font-weight: bold;
  padding: 6px 18px 3px;
`

export const SuggestionButton = styled.button`
  border: 0;
  background: transparent;
  font-size: 14px;
  text-align: left;
  padding: 4px 18px;
  overflow: hidden;
  white-space: nowrap;
  color: grey;
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`

export const SuggestionExpand = styled.button`
  text-align: center;
  padding: 4px 18px;
  border: 0;
  background: transparent;
  color: #3bc78a;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`

export const SuggestionValue = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SuggestionBalance = styled.div`
  white-space: nowrap;
`
