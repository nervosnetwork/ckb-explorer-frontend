import styled from 'styled-components'

export const ChartPanel = styled.div`
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    margin: 20px 4% 0 4%;
    font-size: 16px;
  }
`

export const LoadingPanel = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
  align-items: center;
  justify-content: center;

  > img {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 700px) {
      width: 50px;
      height: 50px;
    }
  }
`
export const ChartsPanel = styled.div`
  margin: 40px 10%;
  padding: 20px 0;
  background: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (max-width: 700px) {
    margin: 20px 4%;
    padding: 10px 0;
  }
`

export const ChartCardPanel = styled.div`
  width: 330px;
  height: 250px;
  background: white;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  margin: 10px 0;

  .chart__card_title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: rgb(151, 151, 151, 0.4);
    color: ${props => props.theme.primary};
    font-size: 14px;
  }
`

export const ChartCardLoadingPanel = styled.div`
  width: 330px;
  height: 250px;
  background: white;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  display: flex;
  justify-content: center;
  align-items: center;
`
