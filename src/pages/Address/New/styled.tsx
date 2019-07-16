import styled from 'styled-components'
import { CommonPagition } from '../../BlockList/styled'

export const AddressContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;

  @media (max-width: 700px) {
    margin-top: 30px;
  }
`

export const AddressHashPanel = styled.div`
  height: 80px;
  width: 100%;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  padding: 0px 0px 24px 0px;

  display: flex;
  flex-direction: row;
  align-items: flex-end;

  .address__title {
    margin-left: 40px;
    font-family: Montserrat;
    font-size: 30px;
    font-weight: 600;
    color: #606060;
    height: 36px;
  }

  .address__hash {
    margin-left: 20px;
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 600;
    color: #606060;
    height: 26px;
  }

  .address__copy_iocn {
    width: 21px;
    height: 24px;
    cursor: pointer;
    margin-left: 20px;

    > img {
      width: 100%;
      height: 100%;
    }
  }
`

export const AddressTitlePanel = styled.div`
  width: 100%;
  height: 50px;
  padding: 15px 0px;
  border-radius: 6px 6px 0px 0px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;

  margin-top: 20px;

  color: #888888;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
`

export const AddressOverviewPanel = styled.div`
  margin-top: 5px;
  width: 100%;
  padding: 22px 40px 30px 40px;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;

  .address_overview__lock_script_title {
    margin-top: 10px;
    color: #888888;
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
  }
`

export const AddressOverviewContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: auto;

  > span {
    width: 1px;
    height: ${`${2 * 40 - 20}px`};
    background: #dfdfdf;
    margin: 10px 0px 10px 0px;
  }

  .address_overview_content__left_items {
    margin-right: 40px;
    flex: 1;
  }

  .address_overview_content__right_items {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 40px;
  }
`

export const AddressOverviewItemPanel = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  width: 100%;

  .address_overview_item__title {
    color: #888888;
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
  }

  .address_overview_item__value {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
    color: #606060;
    margin-left: 15px;
  }
`

export const AddressLockScriptItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  /* height: 28px; */
  margin-top: 10px;

  .address_lock_script__title {
    > img {
      width: 9px;
      height: 9px;
    }

    > span {
      margin-left: 10px;
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
      color: #888888;
    }
  }

  .address_lock_script__content {
    /* background: red; */
    flex: 1;
    margin-left: 20px;
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
    color: #606060;
    display: flex;
    flex-direction: column;
  }
`

export const AddressTransactionsPanel = styled.div`
  width: 100%;
  /* overflow-x: auto; */
`

export const AddressTransactionsPagition = styled(CommonPagition)`
  margin: 80px 0 150px 0;
  width: 100%;
  /* overflow-x: auto; */

  @media (max-width: 700px) {
    margin: 20px 0 30px 3%;
  }
`
