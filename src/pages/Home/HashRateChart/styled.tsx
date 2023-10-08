import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const HomeChartLink = styled(Link)`
  div {
    cursor: pointer !important;
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

    @media (max-width: 1200px) {
      width: 90px;
    }
  }
`
