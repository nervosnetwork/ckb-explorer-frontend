import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const SearchPanel = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: ${(props: { moreHeight?: boolean; hasButton?: boolean }) => (props.moreHeight ? '40px' : '32px')};
  padding-right: ${(props: { moreHeight?: boolean; hasButton?: boolean }) => (props.hasButton ? '0' : '8px')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 0 solid white;
  border-radius: 4px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding-right: 8px;
  }
`

export const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 20px;
  background: white;
  color: #333;
  border: 0 solid white;
  border-radius: 4px;

  &:focus {
    color: #333;
    outline: none;
  }

  &::placeholder {
    color: #888;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    font-size: 12px;
    width: 100%;
    padding-left: 6px;
    padding-right: 16px;
  }
`

export const SearchButton = styled.div`
  flex-shrink: 0;
  width: 72px;
  height: calc(100% - 4px);
  margin: 2px 2px 2px 16px;
  border-radius: 0 4px 4px 0;
  background-color: #121212;
  text-align: center;
  line-height: 34px;
  color: #fff;
  letter-spacing: 0.2px;
  font-size: 14px;
  cursor: pointer;

  @media (max-width: ${variables.mobileBreakPoint}) {
    display: none;
  }
`
