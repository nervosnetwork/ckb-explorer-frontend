import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'
import { AppDispatch } from '../../contexts/providers/reducer'
import { HighLightLink } from '../../components/Text'
import { localeNumberString } from '../../utils/number'
import { parseSimpleDate } from '../../utils/date'
import { DELAY_BLOCK_NUMBER } from '../../utils/const'
import DecimalCapacity from '../../components/DecimalCapacity'
import { shannonToCkb } from '../../utils/util'
import { TableMinerContentItem } from '../../components/Table'

const BlockCardPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: left;
  }

  .block__card__height {
    display: flex;
    flex-direction: column;
    align-items: left;
    flex: 1;

    @media (max-width: 700px) {
      flex-direction: row;
    }

    > div {
      display: flex;

      > span {
        font-size: 14px;
        color: #000000;
        margin-right: 5px;
      }
    }

    .block__card__timestamp {
      font-size: 12px;
      color: #888888;
      margin-top: 10px;
    }
  }

  .block__card__miner {
    display: flex;
    flex-direction: column;
    align-items: left;
    flex: 3;

    > div {
      display: flex;

      .block__card__miner__hash {
        font-size: 14px;
        color: #000000;
        margin-right: 5px;
        font-weight: bold;
      }
    }

    .block__card__reward {
      font-size: 12px;
      color: #888888;

      > span {
        font-weight: normal;
        margin-top: 10px;
        margin-right: 5px;
      }
    }
  }

  .block__card__transaction {
    display: flex;
    flex-direction: column;
    align-items: left;
    flex: 1;

    @media (max-width: 700px) {
      flex-direction: row;
    }

    .block__card__transaction__count {
      font-size: 14px;
      color: #000000;
      font-weight: bold;
    }

    .block__card__live__cells {
      display: flex;
      font-size: 12px;

      > span {
        color: #888888;
        margin-top: 10px;
      }
    }
  }
`

const BlockRewardPlusPanel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 700px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  :after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`

export const BlockCardItem = ({
  block,
  index,
  dispatch,
}: {
  block: State.Block
  index: number
  dispatch: AppDispatch
}) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER ? (
      <BlockRewardPlusPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} fontSize="9px" hideUnit />
      </BlockRewardPlusPanel>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} fontSize="9px" hideUnit />
      </BlockRewardPanel>
    )

  return (
    <BlockCardPanel>
      <div className="block__card__height">
        <div>
          <span>#</span>
          <HighLightLink value={localeNumberString(block.number)} to={`/block/${block.number}`} />
        </div>
        <span className="block__card__timestamp">{parseSimpleDate(block.timestamp)}</span>
      </div>

      <div className="block__card__miner">
        <div>
          <span className="block__card__miner__hash">{i18n.t('home.miner')}</span>
          <TableMinerContentItem width="20%" content={block.minerHash} dispatch={dispatch} />
        </div>
        <div className="block__card__reward">
          <span>{`${i18n.t('home.reward')}`}</span>
          {blockReward}
        </div>
      </div>

      <div className="block__card__transaction">
        <span className="block__card__transaction__count">{`${block.transactionsCount} TXs`}</span>
        <span className="block__card__live__cells">
          {`${Number(block.liveCellChanges) >= 0 ? '+' : '-'} ${block.liveCellChanges} ${i18n.t('home.cells')}`}
        </span>
      </div>
    </BlockCardPanel>
  )
}

export default BlockCardItem
