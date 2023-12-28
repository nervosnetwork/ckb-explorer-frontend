import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const DepositorRankPanel = styled.div`
  width: 100%;
  background: white;
  padding: 20px 40px;
  margin-top: 4px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  border-radius: 0 0 6px 6px;
`

export const DepositorRankCardPanel = styled.div`
  width: 100%;
`

export const DepositorRankTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
  height: 38px;

  > div {
    text-align: center;
  }

  > div:nth-child(1) {
    width: 10%;
  }

  > div:nth-child(2) {
    width: 48%;
  }

  > div:nth-child(3) {
    width: 22%;
  }

  > div:nth-child(4) {
    width: 20%;
  }
`

export const DepositorSeparate = styled.div`
  background: #e2e2e2;
  height: 1px;
  width: 100%;
  margin-bottom: 10px;
`

export const DepositorRankItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 40px;

  @media (max-width: ${variables.largeBreakPoint}) {
    font-size: 14px;
  }

  > div {
    text-align: center;
  }

  > div:nth-child(1) {
    width: 10%;
  }

  > div:nth-child(2) {
    width: 48%;
  }

  > div:nth-child(3) {
    width: 22%;
  }

  > div:nth-child(4) {
    width: 20%;
  }
`
