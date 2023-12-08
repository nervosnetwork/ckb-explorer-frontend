/* eslint-disable no-nested-ternary */
import styled from 'styled-components'

export const SheetPanel = styled.div`
  width: 100%;
  background: #d03a3a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0 20px;

  @media (max-width: 750px) {
    padding: 6px 0 10px;
  }
`

export const SheetItem = styled.div`
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 5px;

  @media (max-width: 750px) {
    font-size: 14px;
  }
`

export const SheetPointPanel = styled.div`
  display: flex;
  align-items: top;
  justify-content: ${(props: { isSingle: boolean }) => (props.isSingle ? 'center' : 'left')};
  width: 50%;

  > span {
    margin-right: 3px;
    margin-top: 8px;
    color: white;
  }

  @media (max-width: 750px) {
    width: 86%;

    > span {
      margin-top: 0;
    }
  }
`
