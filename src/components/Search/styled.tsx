import styled from 'styled-components'
import SimpleButton from '../SimpleButton'

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

  @media (max-width: 750px) {
    border-radius: 4px;
  }
`

export const SearchImage = styled(SimpleButton)`
  display: flex;
  align-items: center;
  margin: ${(props: { isClear?: boolean }) => (props.isClear ? '0 8px 0 0' : '0 0 0 8px')};
  z-index: 2;

  img {
    width: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};
    height: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};
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
  background: white;
  color: #333333;
  border: 0px solid white;
  border-radius: 4px;

  &: focus {
    color: #333333;
    outline: none;
  }

  &::placeholder {
    color: #888888;
  }

  @media (max-width: 750px) {
    font-size: 12px;
    width: 100%;
    padding-left: 6px;
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

  @media (max-width: 750px) {
    display: none;
  }
`
