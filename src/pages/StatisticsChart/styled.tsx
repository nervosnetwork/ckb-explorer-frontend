import styled from 'styled-components'

export const ChartsContent = styled.div`
  margin-top: 40px;

  @media (width <= 750px) {
    margin-top: 20px;
  }
`

export const ChartsTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #000;
`

export const ChartsPanel = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 rgb(0 0 0 / 12%);

  @media (width <= 750px) {
    padding: 20px 10px;
  }

  .charts__category__title {
    font-size: 20px;
    font-weight: 600;
    color: #000;
    margin-left: 10px;
  }

  .charts__category__panel {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0 3px;
  }
`

export const ChartCardPanel = styled.div`
  width: 280px;
  height: 220px;
  background: white;
  margin: 20px 7px;
  cursor: pointer;

  @media (width <= 750px) {
    width: 100%;
  }

  .echarts-for-react {
    canvas {
      cursor: pointer;
    }
  }

  .chart__card__title__penal {
    display: flex;
    align-items: center;
    padding-left: 12px;
    background: #f8f9fa;
    border-radius: 6px 6px 0 0;
    border: 1px solid #e2e2e2;
    border-width: 1px 1px 0;
    height: 40px;

    > img {
      width: 16px;
      height: 16px;
      margin-left: 10px;
    }
  }

  .chart__card_title {
    height: 40px;
    line-height: 40px;
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }

  .chart__card_body {
    border-radius: 0 0 6px 6px;
    box-shadow: 2px 2px 10px 0 rgb(43 43 43 / 5%);
    border: 1px solid #e2e2e2;
  }
`
