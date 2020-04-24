import styled from 'styled-components'

export const UDTSearchPanel = styled.div`
  width: 360px;
  height: 38px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1440px) {
    width: 320px;
  }

  @media (max-width: 750px) {
    width: 84vw;
  }
`

export const UDTSearchImage = styled.div`
  display: inline-block;
  margin-right: -36px;
  margin-left: 8px;
  width: 18px;
  z-index: 2;
  display: flex;
  justify-content: center;

  @media (max-width: 750px) {
    margin-right: ${(props: { isRight?: boolean }) => (props.isRight ? '8px' : '-36px')};
    margin-left: ${(props: { isRight?: boolean }) => (props.isRight ? '-24px' : '8px')};
  }

  img {
    width: 18px;
    height: 18px;
  }
`

export const UDTSearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding-left: ${(props: { isRight?: boolean }) => (props.isRight ? '8px' : '30px')};
  padding-right: ${(props: { isRight?: boolean }) => (props.isRight ? '30px' : '8px')};
  background: rgba(255, 255, 255, 0);
  opacity: 1;
  border: 1px solid #b3b3b3;
  color: #666666;
  border-radius: 6px;

  &: focus {
    color: #666666;
    outline: none;
  }

  &::placeholder {
    color: #bababa;
  }
`
