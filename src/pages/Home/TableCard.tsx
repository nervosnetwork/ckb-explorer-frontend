import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'
import { HighLightLink } from '../../components/Text'
import { localeNumberString } from '../../utils/number'
import { parseDate } from '../../utils/date'
import { DELAY_BLOCK_NUMBER } from '../../utils/const'
import DecimalCapacity from '../../components/DecimalCapacity'
import { shannonToCkbDecimal } from '../../utils/util'
import { TableMinerContentItem } from '../../components/Table'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import { isMobile } from '../../utils/screen'

const BlockCardPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background: #ffffff;

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
        color: #000000;
        margin-right: 3px;
      }

      > div {
        display: flex;
        align-items: center;
      }
    }

    .block__card__timestamp {
      font-size: 12px;
      color: #888888;
      margin-top: 10px;
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

      @media (max-width: 750px) {
        align-items: center;
      }

      .block__card__miner__hash {
        font-size: 14px;
        color: #000000;
        margin-right: 10px;

        @media (max-width: 750px) {
          font-size: 13px;
        }
      }
    }

    .block__card__reward {
      font-size: 12px;
      color: #888888;
      font-weight: 500;

      > span {
        margin-top: 10px;
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
      color: #000000;
      font-weight: 500;
    }

    .block__card__live__cells {
      display: flex;
      font-size: 12px;
      margin-top: 10px;
      margin-left: 10px;
      color: #888888;
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

const TransactionCardPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background: #ffffff;
  font-weight: 500;

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
    font-weight: 500;

    @media (max-width: 750px) {
      font-size: 13px;
    }

    .transaction__card__confirmation {
      font-size: 12px;
      color: #888888;
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
        color: #000000;
        margin-right: 5px;
      }

      .transaction__card__block__height__prefix {
        color: #000000;
        margin-right: 3px;
      }

      > div {
        display: flex;
        align-items: center;
      }
    }

    .transaction__card__timestamp {
      font-size: 12px;
      color: #888888;
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
    color: #000000;

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
      color: #888888;
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

const BlockRewardPlusPanel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 750px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  :after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
    margin-bottom: 2px;
  }
`

const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`

export const BlockCardItem = ({ block, index }: { block: State.Block; index: number }) => {
  const liveCellChanges = Number(block.liveCellChanges)
  const blockReward =
    index < DELAY_BLOCK_NUMBER ? (
      <BlockRewardPlusPanel>
        <DecimalCapacity
          value={localeNumberString(shannonToCkbDecimal(block.reward, 2))}
          fontSize="9px"
          hideUnit
          hideZero
        />
      </BlockRewardPlusPanel>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity
          value={localeNumberString(shannonToCkbDecimal(block.reward, 2))}
          fontSize="9px"
          hideUnit
          hideZero
        />
      </BlockRewardPanel>
    )

  return (
    <BlockCardPanel>
      <div className="block__card__height">
        <div>
          <span>#</span>
          <HighLightLink value={localeNumberString(block.number)} to={`/block/${block.number}`} />
        </div>
        <span className="block__card__timestamp">{parseDate(block.timestamp)}</span>
      </div>

      <div className="block__card__miner">
        <div>
          <span className="block__card__miner__hash">{i18n.t('home.miner')}</span>
          <TableMinerContentItem width="10%" content={block.minerHash} smallWidth fontSize="14px" />
        </div>
        <div className="block__card__reward">
          <span>{`${i18n.t('home.reward')}`}</span>
          {blockReward}
        </div>
      </div>

      <div className="block__card__transaction">
        <span className="block__card__transaction__count">{`${block.transactionsCount} TXs`}</span>
        <span className="block__card__live__cells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${i18n.t('home.cells')}`}
        </span>
      </div>
    </BlockCardPanel>
  )
}

export const TransactionCardItem = ({
  transaction,
  tipBlockNumber,
}: {
  transaction: State.Transaction
  tipBlockNumber: number
}) => {
  const liveCellChanges = Number(transaction.liveCellChanges)
  const confirmation = tipBlockNumber - Number(transaction.blockNumber)
  const confirmationUnit = confirmation > 1 ? i18n.t('address.confirmations') : i18n.t('address.confirmation')
  let transactionHash = adaptPCEllipsis(transaction.transactionHash, 1, 80)
  if (isMobile()) {
    transactionHash = adaptMobileEllipsis(transaction.transactionHash, 12)
  }
  return (
    <TransactionCardPanel>
      <div className="transaction__card__hash">
        <HighLightLink value={transactionHash} to={`/transaction/${transaction.transactionHash}`} />
        <span className="transaction__card__confirmation">{`${confirmation} ${confirmationUnit}`}</span>
      </div>

      <div className="transaction__card__block">
        <div>
          <span className="transaction__card__block__height">{i18n.t('block.block')}</span>
          <span className="transaction__card__block__height__prefix">#</span>
          <HighLightLink value={localeNumberString(transaction.blockNumber)} to={`/block/${transaction.blockNumber}`} />
        </div>
        <div className="transaction__card__timestamp">{parseDate(transaction.blockTimestamp)}</div>
      </div>

      <div className="transaction__card__capacity">
        <DecimalCapacity
          value={localeNumberString(shannonToCkbDecimal(transaction.capacityInvolved, 2))}
          fontSize="9px"
          marginBottom="2px"
          hideZero
        />
        <span className="transaction__card__live__cells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${i18n.t('home.cells')}`}
        </span>
      </div>
    </TransactionCardPanel>
  )
}

export default BlockCardItem
