import styled from 'styled-components'

export const LanguagePanel = styled.div`
  width: 70px;
  height: 74px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  color: #000000;

  left: ${(props: { left: number; top: number }) => props.left}px;
  top: ${(props: { left: number; top: number }) => props.top}px;

  .language__selected {
    width: 90%;
    font-size: 12px;
    height: 33px;
    line-height: 33px;
    margin: 3px 5% 0 5%;
    padding: 0 5%;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #f1f1f1;
    }
  }
  .language__normal {
    width: 90%;
    font-size: 12px;
    height: 33px;
    line-height: 33px;
    margin: 0px 5% 3px 5%;
    padding: 0 5%;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #f1f1f1;
    }
  }

  .language__separate {
    width: 80%;
    height: 0.5px;
    border: solid 0.5px #c3c3c3;
    margin: 0 10%;
  }
`
