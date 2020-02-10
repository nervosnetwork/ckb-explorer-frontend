import styled, { css } from 'styled-components'

export const SearchPanel = styled.div`
  margin: 0 auto;
  width: 100%;
  height: ${(props: { hasBorder: boolean }) => (props.hasBorder ? '42px' : '30px')};
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
  margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-45px' : '0')};
  z-index: 2;

  @media (max-width: 700px) {
    margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-25px' : '0')};
  }

  img {
    width: 16px;
    height: 16px;
    margin-bottom: 3px;

    @media (max-width: 700px) {
      width: 12px;
      height: 12px;
    }
  }
`

export const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-weight: 500;
  padding-left: 35px;
  padding-right: 20px;
  margin-left: -30px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid #606060;
  border-radius: 4px;
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
      margin-left: 0;
      padding-left: 10px;

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
    padding-left: 30px;
    padding-right: 30px;
    margin-left: -30px;
  }
`
