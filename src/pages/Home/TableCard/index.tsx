import React from 'react'
import i18n from '../../../utils/i18n'
import { HighLightLink } from '../../../components/Text'
import { localeNumberString } from '../../../utils/number'
import { parseDate } from '../../../utils/date'
import { DELAY_BLOCK_NUMBER } from '../../../utils/const'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { shannonToCkbDecimal } from '../../../utils/util'
import { TableMinerContentItem } from '../../../components/Table'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../../utils/string'
import { isMobile, isScreenSmallerThan1440 } from '../../../utils/screen'
import { BlockRewardPlusPanel, BlockRewardPanel, BlockCardPanel, TransactionCardPanel } from './styled'

export const BlockCardItem = ({ block, index }: { block: State.Block; index: number }) => {
  const liveCellChanges = Number(block.liveCellChanges)
  const blockReward =
    index < DELAY_BLOCK_NUMBER ? (
      <BlockRewardPlusPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkbDecimal(block.reward, 2))} fontSize="9px" hideUnit hideZero />
        <span>+</span>
      </BlockRewardPlusPanel>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkbDecimal(block.reward, 2))} fontSize="9px" hideUnit hideZero />
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
  let transactionHash = isScreenSmallerThan1440()
    ? adaptPCEllipsis(transaction.transactionHash, 1, 80)
    : adaptPCEllipsis(transaction.transactionHash, 3, 80)
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
