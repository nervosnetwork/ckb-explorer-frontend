import styled from 'styled-components'

export const CardPanel = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
  width: 88%;
  background-color: white;
  padding: 10px 6% 20px 6%;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;
  .sperate__line_top {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
    margin-top: 10px;
  }
  .green__arrow {
    text-align: center;
    margin: 10px 0;
    > img {
      width: 20px;
      height: 20px;
    }
  }
  .sperate__line_bottom {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

export const CardItemPanel = styled.div`
  display: flex;
  margin-top: 10px;
  > div {
    color: #606060;
    font-size: 14px;
    margin-right: 8px;
  }
  .card__value {
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-weight: 450;
    font-size: 14px;
  }
  @media (max-width: 320px) {
    > div {
      font-size: 13px;
    }
    .card__value {
      font-size: 12px;
    }
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  margin-top: 10px;
  .cellbase__content {
    color: #888888;
    font-size: 14px;
    margin-right: 10px;
  }
`

export const CellHashHighLight = styled.div`
  font-size: 14px;
  color: rgb(75, 188, 142);
`
