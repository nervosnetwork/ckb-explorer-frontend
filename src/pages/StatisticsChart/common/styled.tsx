import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const ChartDetailPanel = styled.div`
  margin-bottom: 30px;
  background: white;
`

export const ChartDetailTitle = styled.div`
  background: white;
  margin-top: 30px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin-top: 20px;
  }

  .chartDetailTitlePanel {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    > span {
      color: #000;
      text-align: center;
      font-size: 24px;
      margin-left: 100px;

      @media (max-width: ${variables.mobileBreakPoint}) {
        font-size: 16px;
        margin-left: 0;
      }
    }

    > img {
      width: 18px;
      height: 18px;
      margin-left: 10px;
    }
  }

  .chartDetailTitleDownload {
    width: 100px;
    padding: 5px 0;
    border-radius: 2px;
    border: solid 1px #666;
    font-size: 12px;
    text-align: center;
    color: #666;
    margin-right: 3.6%;

    @media (max-width: ${variables.mobileBreakPoint}) {
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
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  border: solid 0.5px ${props => props.theme.primary};
  background-color: #fff;

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
  width: 100%;
  color: rgb(0 0 0 / 60%);
  padding: 6px 3%;
  text-align: left;
`
