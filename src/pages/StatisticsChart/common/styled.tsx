import styled from 'styled-components'

export const ChartDetailPanel = styled.div`
  margin: 0 120px 30px 120px;
  background: white;

  @media (max-width: 1440px) {
    margin: 0 100px 30px 100px;
  }

  @media (max-width: 1200px) {
    margin: 0 45px 30px 45px;
  }

  @media (max-width: 750px) {
    margin: 0 18px 30px 18px;
  }
`

export const ChartDetailTitle = styled.div`
  background: white;
  margin: 30px 120px 0 120px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1440px) {
    margin: 30 100px 0 100px;
  }

  @media (max-width: 1200px) {
    margin: 30px 45px 0 45px;
  }

  @media (max-width: 750px) {
    margin: 20px 18px 0 18px;
  }

  .chart__detail__title__panel {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    > span {
      color: #000000;
      text-align: center;
      font-size: 24px;
      margin-left: 100px;

      @media (max-width: 750px) {
        font-size: 16px;
        margin-left: 0px;
      }
    }

    > img {
      width: 18px;
      height: 18px;
      margin-left: 10px;
    }
  }

  .chart__detail__title__download {
    width: 100px;
    padding: 5px 0;
    border-radius: 2px;
    border: solid 1px #666666;
    font-size: 12px;
    text-align: center;
    color: #666666;
    margin-right: 3.6%;

    @media (max-width: 750px) {
      display: none;
    }
  }
`

export const LoadingPanel = styled.div`
  display: flex;
  width: 100%;
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

export const ChartNotePanel = styled.div`
  font-size: 12px;
  with: 100%;
  color: rgba(0, 0, 0, 0.6);
  padding: 6px 3%;
  text-align: left;
`
