import styled from 'styled-components'
import SimpleButton from '../../components/SimpleButton'

export const SUDTContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 750px) {
    margin: 0;
    padding: 20px;
  }
`
export const SimpleUDTContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    margin: 0;
    padding: 20px;
  }
`

export const SimpleUDTPendingRewardTitlePanel = styled.div`
  display: flex;
  flex-direction: row;

  #address__pending_reward_help {
    margin-left: 20px;
    width: 20px;
    height: 20px;

    @media (max-width: 750px) {
      margin-left: 10px;
      width: 16px;
      height: 16px;
    }

    > img {
      width: 100%;
      height: 100%;
    }

    &:focus {
      outline: 0;
    }
  }
`

export const SimpleUDTLockScriptController = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  cursor: pointer;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;

  > img {
    width: 12px;
    height: 12px;
    margin: 2px 0 0 5px;
  }

  @media (max-width: 750px) {
    font-size: 14px;
    margin-top: 10px;

    > img {
      margin: 0 0 0 5px;
    }
  }
`

export const SimpleUDTLockScriptPanel = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (max-width: 750px) {
    margin-top: 10px;
  }

  .address__lock_script_title {
    font-weight: 500;
    height: 25px;
    padding: 0 0 5px;

    @media (max-width: 750px) {
      height: 16px;
      padding: 0;
    }
  }
`

export const SimpleUDTLockScriptItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  margin-top: 10px;

  @media (min-width: 750px) {
    height: 20px;
  }

  @media (max-width: 750px) {
    flex-direction: column;
  }

  .address_lock_script__title {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 130px;

    &::before {
      content: ' ';
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: ${prop => prop.theme.primary};

      @media (max-width: 750px) {
        width: 5px;
        height: 5px;
      }
    }

    > span {
      margin-left: 10px;
      font-weight: 500;

      @media (max-width: 750px) {
        margin-left: 5px;
      }
    }
  }

  .address_lock_script__content {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    transform: translateY(2px);

    @media (max-width: 750px) {
      margin-left: 10px;
      word-wrap: break-word;
      word-break: break-all;
      transform: translateY(0);
    }
  }
`

export const TypeScriptController = styled(SimpleButton)`
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;

  > img {
    width: 12px;
    height: 12px;
    margin: 2px 0 0 5px;
  }

  @media (max-width: 750px) {
    font-size: 14px;

    > img {
      margin: 0 0 0 5px;
    }
  }
`

export const SimpleUDTTransactionsPanel = styled.div`
  width: 100%;
`

export const SimpleUDTTransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`

export const UDTTransactionTitlePanel = styled.div`
  width: 100%;
  height: 58px;
  padding: 0 40px;
  background: white;
  border-radius: 6px 6px 0 0;
  box-shadow: 2px 2px 6px 0 #dfdfdf;

  @media (max-width: 750px) {
    height: 108px;
    padding: 16px;
  }

  .udt__transaction__container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    margin-bottom: 5px;

    @media (max-width: 750px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .udt__transaction__title {
    font-size: 24px;
    font-weight: 600;
    font-style: normal;
    line-height: 0.83;
  }
`

export const UDTNoResultPanel = styled.div`
  width: 100%;
  height: 94px;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 12%);
  background-color: #fff;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    white-space: pre-wrap;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #666;
    text-align: center;
  }
`
