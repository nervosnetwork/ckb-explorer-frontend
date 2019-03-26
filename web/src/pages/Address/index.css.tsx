import styled from 'styled-components'

export const AddressContentPanel = styled.div`
  dispaly: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props: { width: number }) => (98 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
`

export const AddressTitlePanel = styled.div`
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

export const AddressOverviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 107px;

  div {
    font-size: 50px;
    color: rgb(20, 20, 20);
    margin: 0 auto;
    width: 218px;
    height: 70px;
  }

  span {
    background: #46ab81;
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }
`

export const AddressCommonContent = styled.div`
  width: 1200px;
  padding: 72px 88px 56px 88px;
  margin: 0 auto;
  margin-top: 50px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px rgb(233, 233, 233);
  display: flex;
  flex-direction: column;
`

export const AddressLabelItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;

  img {
    width: 28px;
    height: 28px;
  }

  span {
    font-size: 18px;
    color: rgb(77, 77, 77);
    margin-left: 10px;
    margin-right: 21px;
  }

  div {
    font-size: 16px;
    color: rgb(75, 188, 142);
  }
`
export const CellConsumedBarDiv = styled.div`
  height: 20px;
  width: 160px;
  border-radius: 50px;
  border: 1px solid rgb(75, 188, 142);
  margin-right: 10px;

  div {
    width: ${(props: { percent: string }) => props.percent}%;
    margin-right: 21px;
    background: rgb(75, 188, 142);
    height: 100%;
    border-radius: inherit;
  }
`
