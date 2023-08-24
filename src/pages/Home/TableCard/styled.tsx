import styled from 'styled-components'

export const BlockCardPanel = styled.div`
  /* stylelint-disable no-descending-specificity */

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background: #fff;

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .block__card__height {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    flex: 2;

    @media (max-width: 750px) {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      font-size: 13px;
    }

    > div {
      display: flex;
      align-items: center;
      font-weight: 500;

      > span {
        color: #000;
        margin-right: 3px;
      }

      > div {
        display: flex;
        align-items: center;
      }
    }

    .block__card__timestamp {
      font-size: 12px;
      color: #888;
      margin-top: 9px;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @media (max-width: 750px) {
        font-size: 12px;
        margin-top: 2px;
        margin-left: 10px;
      }
    }
  }

  .block__card__miner {
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 4;

    @media (max-width: 750px) {
      margin-top: 15px;
    }

    > div {
      display: flex;
      font-weight: 500;
      width: 100%;

      @media (max-width: 750px) {
        align-items: center;
      }

      .block__card__miner__hash {
        font-size: 14px;
        color: #000;
        margin-right: 10px;
        white-space: nowrap;

        @media (max-width: 750px) {
          font-size: 13px;
        }
      }
    }

    .block__card__reward {
      font-size: 14px;
      color: #888;
      font-weight: 500;

      @media (max-width: 750px) {
        font-size: 13px;
      }

      > span {
        margin-top: 9px;
        margin-right: 10px;

        @media (max-width: 750px) {
          margin-top: 0;
        }
      }
    }
  }

  .block__card__transaction {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1.3;

    @media (max-width: 750px) {
      flex-direction: row;
      margin-top: 15px;
      align-items: center;
    }

    .block__card__transaction__count {
      font-size: 13px;
      color: #000;
      font-weight: 500;
    }

    .block__card__live__cells {
      display: flex;
      font-size: 12px;
      margin-top: 9px;
      margin-left: 10px;
      color: #888;
      font-weight: 500;

      @media (max-width: 900px) {
        font-size: 10px;
      }

      @media (max-width: 750px) {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }
`

export const TransactionCardPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background: #fff;
  font-weight: 500;
  max-height: 83px;

  @media screen and (max-width: 790px) {
    max-height: unset;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .transaction__card__hash {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    flex: 1.4;
    min-width: 0;
    max-width: 100%;
    font-weight: 500;

    @media (max-width: 750px) {
      font-size: 13px;
    }

    .transaction__card__confirmation {
      font-size: 12px;
      color: #888;
      margin-top: 10px;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @media (max-width: 750px) {
        margin-top: 0;
      }
    }
  }

  .transaction__card__block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;

    @media (max-width: 750px) {
      margin-top: 15px;
    }

    > div {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;

      @media (max-width: 750px) {
        font-size: 13px;
      }

      .transaction__card__block__height {
        color: #000;
        margin-right: 5px;
        white-space: nowrap;
      }

      .transaction__card__block__height__prefix {
        color: #000;
        margin-right: 3px;
      }

      > div {
        display: flex;
        align-items: center;
      }
    }

    .transaction__card__timestamp {
      font-size: 12px;
      color: #888;
      margin-top: 10px;
      margin-right: 10px;
      font-weight: 500;

      @media (max-width: 750px) {
        font-size: 12px;
        margin-top: 0;
      }
    }
  }

  .transaction__card__capacity {
    display: flex;
    flex-direction: column;
    align-items: left;
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #000;

    @media (max-width: 750px) {
      flex-direction: row;
      margin-top: 15px;
      font-size: 13px;
    }

    .transaction__card__live__cells {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      margin-top: 10px;
      color: #888;
      font-weight: 500;

      @media (max-width: 900px) {
        margin-left: 10px;
      }

      @media (max-width: 750px) {
        font-size: 12px;
        margin-top: 2px;
        margin-left: 10px;
      }
    }
  }
`

export const BlockRewardPlusPanel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 750px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  > span {
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
    margin-bottom: -1px;
    margin-left: 2px;
  }
`

export const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`
