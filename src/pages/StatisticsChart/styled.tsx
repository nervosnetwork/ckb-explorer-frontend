import styled from 'styled-components'

export const ChartDetailPanel = styled.div`
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 750px) {
    margin: 0 4% 30px 4%;
  }
`

export const ChartDetailTitle = styled.div`
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
  width: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '270px' : '100%')};
  height: ${(props: { isThumbnail?: boolean }) => (props.isThumbnail ? '200px' : '70vh')};
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

export const ChartsContent = styled.div`
  margin: 40px 6%;
  @media (max-width: 750px) {
    margin: 20px 4%;
  }
`

export const ChartsTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`

export const ChartsPanel = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.12);

  @media (max-width: 750px) {
    padding: 20px 10px;
  }

  .charts__category__title {
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    margin-left: 10px;
  }

  .charts__category__panel {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0px 3px;
  }
`

export const ChartCardPanel = styled.div`
  width: 270px;
  height: 220px;
  background: white;
  margin: 20px 7px;
  cursor: pointer;

  @media (max-width: 750px) {
    width: 100%;
  }

  .echarts-for-react {
    canvas {
      cursor: pointer;
    }
  }

  .chart__card_title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #f8f9fa;
    border-radius: 6px 6px 0 0;
    border: 1px solid #e2e2e2;
    border-width: 1px 1px 0 1px;
    color: #000000;
    font-size: 14px;
  }

  .chart__card_body {
    border-radius: 0 0 6px 6px;
    box-shadow: 2px 2px 10px 0 rgb(43, 43, 43, 0.05);
    border: 1px solid #e2e2e2;
  }
`

export const ChartNotePanel = styled.div`
  font-size: 12px;
  with: 100%;
  color: rgba(0, 0, 0, 0.6);
  padding: 6px 3%;
  text-align: left;
`
