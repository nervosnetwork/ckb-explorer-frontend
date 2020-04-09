import styled from 'styled-components'

export const ChartPanel = styled.div`
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 750px) {
    margin: 0 4% 30px 4%;
  }
`

export const ChartTitle = styled.div`
  color: #66666;
  background: white;
  margin: 30px 10% 0 10%;
  padding-top: 10px;
  font-size: 24px;
  text-align: center;

  @media (max-width: 750px) {
    margin: 20px 4% 0 4%;
    font-size: 16px;
  }
`

export const LoadingPanel = styled.div`
  display: flex;
  width: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '330px' : '100%')};
  height: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '230px' : '70vh')};
  align-items: center;
  justify-content: center;
`

export const ChartNoDataPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '92px' : '184px')};
  height: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '56px' : '112px')};
  border-radius: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 0.5px ${props => props.theme.primary};
  background-color: #ffffff;

  > img {
    width: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '18.5px' : '37px')};
    height: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '14px' : '28px')};
  }

  > span {
    font-size: 12px;
    font-weight: 500;
    margin-top: 5px;
    color: ${props => props.theme.primary};
  }
`

export const ChartsPanel = styled.div`
  margin: 40px 6%;
  padding: 0 20px 20px 20px;
  background: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 750px) {
    margin: 20px 4%;
    padding: 10px 0;
  }
`

export const ChartCardPanel = styled.div`
  width: 330px;
  height: 250px;
  background: white;
  margin: 25px 10px;
  cursor: pointer;

  .echarts-for-react {
    canvas {
      cursor: pointer;
    }
  }

  .chart__card_title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #fbfbfb;
    border-radius: 6px 6px 0 0;
    border: 1px solid #e2e2e2;
    border-width: 1px 1px 0 1px;
    color: ${props => props.theme.primary};
    font-size: 14px;
    font-weight: 600;
  }

  .chart__card_body {
    border-radius: 0 0 6px 6px;
    box-shadow: 2px 2px 10px 0 rgb(43, 43, 43, 0.05);
    border: 1px solid #e2e2e2;
  }
`
