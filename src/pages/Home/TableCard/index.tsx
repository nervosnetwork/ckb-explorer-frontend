import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HighLightLink } from '../../../components/Text'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { shannonToCkbDecimal, deprecatedAddrToNewAddr } from '../../../utils/util'
import { TableMinerContentItem } from '../../../components/Table'
import { BlockRewardPlusPanel, BlockRewardPanel, BlockCardPanel, TransactionCardPanel } from './styled'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'
import { useParsedDate } from '../../../utils/hook'

// eslint-disable-next-line no-underscore-dangle
const _BlockCardItem: FC<{ block: State.Block; isDelayBlock?: boolean }> = ({ block, isDelayBlock }) => {
  const { t } = useTranslation()
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

  const parsedBlockCreateAt = useParsedDate(block.timestamp)

  return (
    <BlockCardPanel>
      <div className="blockCardHeight">
        <div>
          <span>#</span>
          <HighLightLink value={localeNumberString(block.number)} to={`/block/${block.number}`} />
        </div>
        <span className="blockCardTimestamp">{parsedBlockCreateAt}</span>
      </div>

      <div className="blockCardMiner">
        <div>
          <span className="blockCardMinerHash">{t('home.miner')}</span>
          <TableMinerContentItem content={deprecatedAddrToNewAddr(block.minerHash)} fontSize="14px" />
        </div>
        <div className="blockCardReward">
          <span>{`${t('home.reward')}`}</span>
          {blockReward}
        </div>
      </div>

      <div className="blockCardTransaction">
        <span className="blockCardTransactionCount">{`${block.transactionsCount} TXs`}</span>
        <span className="blockCardLiveCells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${t('home.cells')}`}
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
  const { t } = useTranslation()
  const liveCellChanges = Number(transaction.liveCellChanges)
  let confirmation = tipBlockNumber - Number(transaction.blockNumber)
  confirmation = confirmation < 0 ? 0 : confirmation
  const confirmationUnit = confirmation > 1 ? t('address.confirmations') : t('address.confirmation')

  const parsedBlockCreateAt = useParsedDate(transaction.blockTimestamp)

  return (
    <TransactionCardPanel>
      <div className="transactionCardHash">
        <AddressText
          disableTooltip
          linkProps={{
            className: styles.transactionAddress,
            to: `/transaction/${transaction.transactionHash}`,
          }}
        >
          {transaction.transactionHash}
        </AddressText>
        <span className="transactionCardConfirmation">{`${confirmation} ${confirmationUnit}`}</span>
      </div>

      <div className="transactionCardBlock">
        <div>
          <span className="transactionCardBlockHeight">{t('block.block')}</span>
          <span className="transactionCardBlockHeightPrefix">#</span>
          <HighLightLink value={localeNumberString(transaction.blockNumber)} to={`/block/${transaction.blockNumber}`} />
        </div>
        <div className="transactionCardTimestamp">{parsedBlockCreateAt}</div>
      </div>

      <div className="transactionCardCapacity">
        <DecimalCapacity
          value={localeNumberString(shannonToCkbDecimal(transaction.capacityInvolved, 2))}
          fontSize="9px"
          hideZero
        />
        <span className="transactionCardLiveCells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${t('home.cells')}`}
        </span>
      </div>
    </TransactionCardPanel>
  )
}
export const TransactionCardItem = memo(
  _TransactionCardItem,
  (a, b) => a.transaction.transactionHash === b.transaction.transactionHash && a.tipBlockNumber === b.tipBlockNumber,
)
