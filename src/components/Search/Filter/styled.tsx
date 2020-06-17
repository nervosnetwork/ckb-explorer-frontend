import styled from 'styled-components'
import SimpleButton from '../../SimpleButton'

export const FilterPanel = styled.div`
  width: 600px;
  height: 30px;
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

export const FilterImage = styled(SimpleButton)`
  display: inline-block;
  margin-left: ${(props: { isClear?: boolean }) => (props.isClear ? '-40px' : '0')};
  margin-right: ${(props: { isClear?: boolean }) => (props.isClear ? '0' : '-40px')};
  width: 30px;
  z-index: 2;
  display: flex;
  justify-content: center;

  @media (max-width: 750px) {
    margin-left: ${(props: { isClear?: boolean }) => (props.isClear ? '-30px' : '0')};
    margin-right: ${(props: { isClear?: boolean }) => (props.isClear ? '0' : '-30px')};
  }

  img {
    margin-top: 3px;
    width: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};
    height: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};

    @media (max-width: 750px) {
      margin-top: 0;
    }
  }
`

export const FilterInputPanel = styled.input`
  position: relative;
  width: ${(props: { showReset: boolean }) => (props.showReset ? '85%' : '100%')};
  height: 100%;
  font-size: 16px;
  padding-left: 26px;
  padding-right: 30px;
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
    width: ${(props: { showReset: boolean }) => (props.showReset ? '83%' : '100%')};
    font-size: 12px;
  }
`

export const ResetButtonPanel = styled.div`
  background: #f4f4f4;
  color: #000000;
  border-radius: 2px;
  font-size: 12px;
  width: 60px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
`
