import styled from 'styled-components'
import SimpleButton from '../../SimpleButton'
import variables from '../../../styles/variables.module.scss'

export const FilterPanel = styled.div`
  width: 600px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${variables.extraLargeBreakPoint}) {
    width: 450px;
  }

  @media (max-width: ${variables.largeBreakPoint}) {
    width: 320px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: 100%;
  }
`

export const FilterImage = styled(SimpleButton)`
  margin-left: ${(props: { isClear?: boolean }) => (props.isClear ? '-40px' : '0')};
  margin-right: ${(props: { isClear?: boolean }) => (props.isClear ? '0' : '-40px')};
  width: 34px;
  z-index: 2;
  display: flex;
  justify-content: center;
  cursor: ${(props: { isClear?: boolean }) => (props.isClear ? 'pointer' : 'default')};

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-left: ${(props: { isClear?: boolean }) => (props.isClear ? '-14%' : '0')};
    margin-right: ${(props: { isClear?: boolean }) => (props.isClear ? '0' : '-14%')};
  }

  img {
    margin-top: 3px;
    width: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};
    height: ${(props: { isClear?: boolean }) => (props.isClear ? '12px' : '18px')};

    @media (max-width: ${variables.mobileBreakPoint}) {
      margin-top: 0;
    }
  }
`

export const FilterInputPanel = styled.input`
  position: relative;
  width: ${(props: { showReset: boolean }) => (props.showReset ? '530px' : '100%')};
  height: 100%;
  font-size: 16px;
  padding-left: 36px;
  padding-right: 30px;
  background: rgb(255 255 255 / 0%);
  opacity: 1;
  border: 0 solid white;
  color: #666;
  border-radius: 4px;
  background-color: #f4f4f4;

  &:focus {
    color: #666;
    outline: none;
  }

  &::placeholder {
    color: #bababa;
  }

  @media (max-width: ${variables.extraLargeBreakPoint}) {
    width: ${(props: { showReset: boolean }) => (props.showReset ? '380px' : '100%')};
  }

  @media (max-width: ${variables.largeBreakPoint}) {
    width: ${(props: { showReset: boolean }) => (props.showReset ? '250px' : '100%')};
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: ${(props: { showReset: boolean }) => (props.showReset ? '82%' : '100%')};
    font-size: 12px;
  }
`

export const ResetButtonPanel = styled.div`
  background: #f4f4f4;
  color: #000;
  border-radius: 2px;
  font-size: 12px;
  width: 55px;
  height: 38px;
  line-height: 38px;
  cursor: pointer;

  &:hover {
    background: #ddd;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: 50px;
  }
`
