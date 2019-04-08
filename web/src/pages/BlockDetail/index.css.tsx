import styled from 'styled-components'

export const BlockDetailPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (100 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const BlockDetailTitlePanel = styled.div`
  dispaly: flex;
  flex-direction: column;
  align-items: center;

  .address__title {
    color: rgb(20, 20, 20);
    font-size: 40pt;
    text-align: center;
  }

  .address__content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    div {
      color: rgb(136, 136, 136);
      font-size: 18px;
      height: 25px;
    }

    img {
      margin-left: 19px;
      width: 24px;
      height: 21px;
    }
  }
`

export const BlockOverviewPanel = styled.div`
  margin-top: 107px;
  margin-bottom: 50px;
  font-size: 50px;
  color: rgb(20, 20, 20);
  height: 70px;

  &:after {
    display: block;
    content: '';
    margin: 0 auto;
    background: #46ab81;
    height: 4px;
    width: 197px;
  }
`
