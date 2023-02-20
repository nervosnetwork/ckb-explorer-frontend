import { FC, memo } from 'react'
import i18n from '../../../utils/i18n'
import { HighLightLink } from '../../../components/Text'
import { localeNumberString } from '../../../utils/number'
import { parseDate } from '../../../utils/date'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { shannonToCkbDecimal, deprecatedAddrToNewAddr } from '../../../utils/util'
import { TableMinerContentItem } from '../../../components/Table'
import { BlockRewardPlusPanel, BlockRewardPanel, BlockCardPanel, TransactionCardPanel } from './styled'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'

// eslint-disable-next-line no-underscore-dangle
const _BlockCardItem: FC<{ block: State.Block; isDelayBlock?: boolean }> = ({ block, isDelayBlock }) => {
  const liveCellChanges = Number(block.liveCellChanges)
  const blockReward = isDelayBlock ? (
    <BlockRewardPlusPanel>
      <DecimalCapacity
        value={localeNumberString(shannonToCkbDecimal(block.reward, 2))}
        fontSize="9px"
        hideUnit
        hideZero
      />
      <span>+</span>
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
          <TableMinerContentItem content={deprecatedAddrToNewAddr(block.minerHash)} fontSize="14px" />
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
export const BlockCardItem = memo(
  _BlockCardItem,
  (a, b) => a.block.number === b.block.number && a.isDelayBlock === b.isDelayBlock,
)

// eslint-disable-next-line no-underscore-dangle
const _TransactionCardItem: FC<{
  transaction: State.Transaction
  tipBlockNumber: number
}> = ({ transaction, tipBlockNumber }) => {
  const liveCellChanges = Number(transaction.liveCellChanges)
  let confirmation = tipBlockNumber - Number(transaction.blockNumber)
  confirmation = confirmation < 0 ? 0 : confirmation
  const confirmationUnit = confirmation > 1 ? i18n.t('address.confirmations') : i18n.t('address.confirmation')

  return (
    <TransactionCardPanel>
      <div className="transaction__card__hash">
        <AddressText
          disableTooltip
          linkProps={{
            className: styles.transactionAddress,
            to: `/transaction/${transaction.transactionHash}`,
          }}
        >
          {transaction.transactionHash}
        </AddressText>
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
export const TransactionCardItem = memo(
  _TransactionCardItem,
  (a, b) => a.transaction.transactionHash === b.transaction.transactionHash && a.tipBlockNumber === b.tipBlockNumber,
)
