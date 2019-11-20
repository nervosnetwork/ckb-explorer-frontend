import styled, { css } from 'styled-components'

export const SearchPanel = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 50px;
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
  margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-45px' : '0')};
  z-index: 2;

  @media (max-width: 700px) {
    margin-left: ${(props: { highlightIcon: boolean }) => (props.highlightIcon ? '-25px' : '0')};
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
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 46px;
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
    padding-right: 30px;
  }
`
