import styled from 'styled-components'

export const DaoSearchPanel = styled.div`
  width: 600px;
  height: 38px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1200px) {
    width: 450px;
  }

  @media (max-width: 750px) {
    width: 84vw;
  }
`

export const DaoSearchImage = styled.div`
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

export const DaoSearchInputPanel = styled.input`
  position: relative;
  width: ${(props: { showReset: boolean }) => (props.showReset ? '85%' : '100%')};
  height: 100%;
  font-size: 16px;
  padding-left: 30px;
  padding-right: 50px;
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

  @media (max-width: 750px) {
    width: 100%;
    padding-right: 30px;
  }
`

export const DaoResetButtonPanel = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  width: 65px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;

  @media (max-width: 750px) {
    border-radius: 3px;
    font-size: 12px;
    width: 45px;
    height: 24px;
    line-height: 24px;
  }
`
