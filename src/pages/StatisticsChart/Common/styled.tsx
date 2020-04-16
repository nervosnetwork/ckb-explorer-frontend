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

export const ChartNotePanel = styled.div`
  font-size: 12px;
  with: 100%;
  color: rgba(0, 0, 0, 0.6);
  padding: 6px 3%;
  text-align: left;
`
