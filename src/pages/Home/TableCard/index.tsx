import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { HighLightLink } from '../../../components/Text'
import { localeNumberString } from '../../../utils/number'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../../utils/util'
import { TableMinerContentItem } from '../../../components/Table'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'
import { useParsedDate } from '../../../hooks'

// eslint-disable-next-line no-underscore-dangle
const _BlockCardItem: FC<{
  block: {
    number: number
    timestamp: number
    liveCellChanges: string
    reward: string
    transactionsCount: number
    minerHash: string
  }
  isDelayBlock?: boolean
}> = ({ block, isDelayBlock }) => {
  const { t } = useTranslation()
  const liveCellChanges = Number(block.liveCellChanges)
  const [int, dec] = new BigNumber(shannonToCkb(block.reward)).toFormat(2, BigNumber.ROUND_FLOOR).split('.')

  const parsedBlockCreateAt = useParsedDate(block.timestamp)

  return (
    <div className={styles.blockCardPanel}>
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
          <div className={styles.reward}>
            <span data-role="int">{int}</span>
            {dec ? <span data-role="dec" className="monospace">{`.${dec}`}</span> : null}
            {isDelayBlock ? <span data-role="suffix">+</span> : null}
          </div>
        </div>
      </div>

      <div className="blockCardTransaction">
        <span className="blockCardTransactionCount">{`${block.transactionsCount} TXs`}</span>
        <span className="blockCardLiveCells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${t('home.cells')}`}
        </span>
      </div>
    </div>
  )
}
export const BlockCardItem = memo(
  _BlockCardItem,
  (a, b) => a.block.number === b.block.number && a.isDelayBlock === b.isDelayBlock,
)

// eslint-disable-next-line no-underscore-dangle
const _TransactionCardItem: FC<{
  transaction: {
    transactionHash: string
    blockNumber: string | number
    blockTimestamp: string | number
    capacityInvolved: string
    liveCellChanges: string
  }
  tipBlockNumber: number
}> = ({ transaction, tipBlockNumber }) => {
  const { t } = useTranslation()
  const liveCellChanges = Number(transaction.liveCellChanges)
  let confirmation = tipBlockNumber - Number(transaction.blockNumber)
  confirmation = confirmation < 0 ? 0 : confirmation
  const confirmationUnit = confirmation > 1 ? t('address.confirmations') : t('address.confirmation')

  const parsedBlockCreateAt = useParsedDate(transaction.blockTimestamp)

  const [int, dec] = new BigNumber(shannonToCkb(transaction.capacityInvolved)).toFormat(2).split('.')
  return (
    <div className={styles.transactionCardPanel}>
      <div className="transactionCardHash">
        <AddressText
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
        <div className={styles.capacity}>
          <span data-role="int">{int}</span>
          {dec ? <span data-role="dec" className="monospace">{`.${dec}`}</span> : null}
          <span className="monospace" data-role="unit">
            CKB
          </span>
        </div>
        <span className="transactionCardLiveCells">
          {`${liveCellChanges >= 0 ? '+' : '-'}${Math.abs(liveCellChanges)} ${t('home.cells')}`}
        </span>
      </div>
    </div>
  )
}
export const TransactionCardItem = memo(
  _TransactionCardItem,
  (a, b) => a.transaction.transactionHash === b.transaction.transactionHash && a.tipBlockNumber === b.tipBlockNumber,
)
