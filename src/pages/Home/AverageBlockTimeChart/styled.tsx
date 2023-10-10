import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

  .chart__no__data {
    width: 105px;
    height: auto;

    @media (max-width: 1200px) {
      width: 90px;
    }
  }
`
