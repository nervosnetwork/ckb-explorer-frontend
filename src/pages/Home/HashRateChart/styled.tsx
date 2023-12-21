import styled from 'styled-components'
import { Link } from 'react-router-dom'
import variables from '../../../styles/variables.module.scss'

export const HomeChartLink = styled(Link)`
  canvas {
    cursor: pointer;
  }
`

export const ChartLoadingPanel = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .chartNoData {
    width: 105px;
    height: auto;

    @media (max-width: ${variables.extraLargeBreakPoint}) {
      width: 90px;
    }
  }
`
