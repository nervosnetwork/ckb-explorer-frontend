/* eslint-disable react/no-array-index-key */
import { useState, ReactNode, FC } from 'react'
import { Link } from 'react-router-dom'
import { Progress, Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useAppState } from '../../contexts/providers/index'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { formatConfirmation, shannonToCkb, matchTxHash } from '../../utils/util'
import {
  TransactionBlockHeightPanel,
  TransactionInfoContentPanel,
  TransactionOverviewPanel,
  TransactionInfoContentItem,
  TransactionInfoItemPanel,
} from './styled'
import TransactionCellList from './TransactionCellList'
import DecimalCapacity from '../../components/DecimalCapacity'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import MoreIcon from '../../assets/more.png'
import { isMainnet } from '../../utils/chain'
import SimpleButton from '../../components/SimpleButton'
import HashTag from '../../components/HashTag'
import { isScreenSmallerThan1440 } from '../../utils/screen'
import { useAddrFormatToggle } from '../../utils/hook'
import styles from './styles.module.scss'

const showTxStatus = (txStatus: string) => txStatus.replace(/^\S/, s => s.toUpperCase())

const TransactionBlockHeight = ({ blockNumber, txStatus }: { blockNumber: number; txStatus: string }) => (
  <TransactionBlockHeightPanel>
    {txStatus === 'committed' ? (
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    ) : (
      <span>{showTxStatus(txStatus)}</span>
    )}
  </TransactionBlockHeightPanel>
)

const transactionParamsIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const TransactionInfoItem = ({
  title,
  value,
  linkUrl,
  tag,
}: {
  title?: string
  value: string | ReactNode
  linkUrl?: string
  tag?: ReactNode
}) => (
  <TransactionInfoContentItem>
    <div className="transaction__info__content_title">{title ? `${title}: ` : ''}</div>
    <div className="transaction__info__content_value monospace">
      {linkUrl ? (
        <Link to={linkUrl} className="monospace">
          {value}
        </Link>
      ) : (
        value
      )}
      {tag && <div className="transaction__info__content__tag">{tag}</div>}
    </div>
  </TransactionInfoContentItem>
)

const TransactionInfoItemWrapper = ({
  title,
  value,
  linkUrl,
}: {
  title?: string
  value: string | ReactNode
  linkUrl?: string
}) => (
  <TransactionInfoContentPanel>
    <TransactionInfoItem title={title} value={value} linkUrl={linkUrl} />
  </TransactionInfoContentPanel>
)

export const TransactionOverview: FC<{ transaction: State.Transaction }> = ({ transaction }) => {
  const [showParams, setShowParams] = useState<boolean>(false)
  const {
    app: { tipBlockNumber },
  } = useAppState()
  const {
    blockNumber,
    cellDeps,
    headerDeps,
    witnesses,
    blockTimestamp,
    transactionFee,
    txStatus,
    detailedMessage,
    bytes,
    largestTxInEpoch,
    largestTx,
    cycles,
    maxCyclesInEpoch,
    maxCycles,
  } = transaction

  let confirmation = 0
  if (tipBlockNumber && blockNumber) {
    confirmation = tipBlockNumber - blockNumber
  }

  const OverviewItems: Array<OverviewItemData> = [
    {
      title: i18n.t('block.block_height'),
      content: <TransactionBlockHeight blockNumber={blockNumber} txStatus={txStatus} />,
    },
  ]
  if (txStatus === 'committed') {
    if (confirmation >= 0) {
      OverviewItems.push(
        {
          title: i18n.t('block.timestamp'),
          content: parseSimpleDate(blockTimestamp),
        },
        bytes
          ? {
              title: `${i18n.t('transaction.transaction_fee')} | ${i18n.t('transaction.fee_rate')}`,
              content: (
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />
                  <span
                    style={{
                      whiteSpace: 'pre',
                    }}
                  >{` | ${new BigNumber(transactionFee).multipliedBy(1000).dividedToIntegerBy(bytes).toFormat({
                    groupSeparator: ',',
                    groupSize: 3,
                  })} shannons/kB`}</span>
                </div>
              ),
            }
          : {
              title: i18n.t('transaction.transaction_fee'),
              content: <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />,
            },

        {
          title: i18n.t('transaction.status'),
          content: formatConfirmation(confirmation),
        },
      )
    }
  } else {
    OverviewItems.push(
      {
        title: i18n.t('block.timestamp'),
        content: showTxStatus(txStatus),
      },
      {
        title: i18n.t('transaction.transaction_fee'),
        content: <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />,
      },
      {
        title: i18n.t('transaction.status'),
        content: showTxStatus(txStatus),
        valueTooltip: txStatus === 'rejected' ? detailedMessage : undefined,
      },
    )
  }

  const blockSizePercentOfLargestInEpoch = bytes && largestTxInEpoch ? Math.round(100 * (bytes / largestTxInEpoch)) : 0
  const blockSizePercentOfLargestInChain = bytes && largestTx ? Math.round(100 * (bytes / largestTx)) : 0
  const cyclesPercentOfMaxInEpoch = cycles && maxCyclesInEpoch ? Math.round(100 * (cycles / maxCyclesInEpoch)) : 0
  const cyclesPercentOfMaxInChain = cycles && maxCycles ? Math.round(100 * (cycles / maxCycles)) : 0
  OverviewItems.push(
    {
      title: i18n.t('transaction.size'),
      content: bytes ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${(bytes - 4).toLocaleString('en')} Bytes`}
          <Tooltip
            placement="top"
            overlayClassName={styles.comparedSizeTooltip}
            title={
              <>
                {largestTxInEpoch ? (
                  <div>
                    <div>Compared to the max size in epoch</div>
                    <div>
                      {localeNumberString(largestTxInEpoch)} ({blockSizePercentOfLargestInEpoch}%)
                    </div>
                    <Progress percent={blockSizePercentOfLargestInEpoch} showInfo={false} status="success" />
                  </div>
                ) : null}
                {largestTx ? (
                  <div>
                    <div>Compared to the max size in chain</div>
                    <div>
                      {localeNumberString(largestTx)} ({blockSizePercentOfLargestInChain}%)
                    </div>
                    <Progress percent={blockSizePercentOfLargestInChain} showInfo={false} status="normal" />
                  </div>
                ) : null}
              </>
            }
          >
            <img
              src={MoreIcon}
              alt="more"
              style={{
                width: 15,
                height: 15,
                marginLeft: 6,
              }}
            />
          </Tooltip>
        </div>
      ) : (
        ''
      ),
    },
    null,
    {
      title: i18n.t('transaction.cycles'),
      content: cycles ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${cycles.toLocaleString('en')}`}
          <Tooltip
            placement="top"
            overlayClassName={styles.comparedSizeTooltip}
            title={
              <>
                {maxCyclesInEpoch ? (
                  <div>
                    <div>Compared to the max cycles in epoch</div>
                    <div>
                      {localeNumberString(maxCyclesInEpoch)} ({cyclesPercentOfMaxInEpoch}%)
                    </div>
                    <Progress percent={cyclesPercentOfMaxInEpoch} showInfo={false} status="success" />
                  </div>
                ) : null}
                {maxCycles ? (
                  <div>
                    <div>Compared to the max cycles in chain</div>
                    <div>
                      {localeNumberString(maxCycles)} ({cyclesPercentOfMaxInChain}%)
                    </div>
                    <Progress percent={cyclesPercentOfMaxInChain} showInfo={false} status="normal" />
                  </div>
                ) : null}
              </>
            }
          >
            <img
              src={MoreIcon}
              alt="more"
              style={{
                width: 15,
                height: 15,
                marginLeft: 6,
              }}
            />
          </Tooltip>
        </div>
      ) : (
        '-'
      ),
    },
  )

  const TransactionParams = [
    {
      title: i18n.t('transaction.cell_deps'),
      content:
        cellDeps && cellDeps.length > 0 ? (
          cellDeps.map(cellDep => {
            const {
              outPoint: { txHash, index },
              depType,
            } = cellDep
            const hashTag = matchTxHash(txHash, index)
            return (
              <TransactionInfoContentPanel key={`${txHash}${index}`}>
                <TransactionInfoItem
                  title={i18n.t('transaction.out_point_tx_hash')}
                  value={txHash}
                  linkUrl={`/transaction/${txHash}`}
                  tag={
                    !isScreenSmallerThan1440() &&
                    hashTag && <HashTag content={hashTag.tag} category={hashTag.category} />
                  }
                />
                {isScreenSmallerThan1440() && hashTag && (
                  <TransactionInfoItem value={<HashTag content={hashTag.tag} category={hashTag.category} />} />
                )}
                <TransactionInfoItem title={i18n.t('transaction.out_point_index')} value={index} />
                <TransactionInfoItem title={i18n.t('transaction.dep_type')} value={depType} />
              </TransactionInfoContentPanel>
            )
          })
        ) : (
          <TransactionInfoItemWrapper title="CellDep" value="[ ]" />
        ),
    },
    {
      title: i18n.t('transaction.header_deps'),
      content:
        headerDeps && headerDeps.length > 0 ? (
          headerDeps.map(headerDep => (
            <TransactionInfoItemWrapper
              key={headerDep}
              title={i18n.t('transaction.header_dep')}
              value={headerDep}
              linkUrl={`/block/${headerDep}`}
            />
          ))
        ) : (
          <TransactionInfoItemWrapper title={i18n.t('transaction.header_dep')} value="[ ]" />
        ),
    },
    {
      title: i18n.t('transaction.witnesses'),
      content:
        witnesses && witnesses.length > 0 ? (
          witnesses.map((witness, index) => (
            <TransactionInfoItemWrapper key={`${witness}-${index}`} title="Witness" value={witness} />
          ))
        ) : (
          <TransactionInfoItemWrapper title="Witness" value="[ ]" />
        ),
    },
  ]

  return (
    <TransactionOverviewPanel>
      <OverviewCard items={OverviewItems} hideShadow>
        <div className="transaction__overview_info">
          <SimpleButton className="transaction__overview_parameters" onClick={() => setShowParams(!showParams)}>
            <div>{i18n.t('transaction.transaction_parameters')}</div>
            <img alt="transaction parameters" src={transactionParamsIcon(showParams)} />
          </SimpleButton>
          {showParams && (
            <div className="transaction__overview_params">
              {TransactionParams.map(item => (
                <TransactionInfoItemPanel key={item.title}>
                  <div className="transaction__info_title">{item.title}</div>
                  <div className="transaction__info_value">{item.content}</div>
                </TransactionInfoItemPanel>
              ))}
            </div>
          )}
        </div>
      </OverviewCard>
    </TransactionOverviewPanel>
  )
}

const handleCellbaseInputs = (inputs: State.Cell[], outputs: State.Cell[]) => {
  if (inputs[0] && inputs[0].fromCellbase && outputs[0] && outputs[0].baseReward) {
    const resultInputs = inputs
    resultInputs[0] = {
      ...resultInputs[0],
      baseReward: outputs[0].baseReward,
      secondaryReward: outputs[0].secondaryReward,
      commitReward: outputs[0].commitReward,
      proposalReward: outputs[0].proposalReward,
    }
    return resultInputs
  }
  return inputs
}

export default ({ transaction }: { transaction: State.Transaction }) => {
  const { transactionHash, displayInputs, displayOutputs, blockNumber, isCellbase, txStatus } = transaction

  const { isNew: isAddrNew, setIsNew: setIsAddrNew } = useAddrFormatToggle()
  const inputs = handleCellbaseInputs(displayInputs, displayOutputs)

  /// [0, 11] block doesn't show block reward and only cellbase show block reward
  return (
    <>
      <div className="transaction__inputs">
        {inputs && (
          <TransactionCellList
            inputs={inputs}
            showReward={blockNumber > 0 && isCellbase}
            txStatus={txStatus}
            addrToggle={{
              isAddrNew,
              setIsAddrNew,
            }}
          />
        )}
      </div>
      <div className="transaction__outputs">
        {displayOutputs && (
          <TransactionCellList
            outputs={displayOutputs}
            txHash={transactionHash}
            txStatus={txStatus}
            addrToggle={{
              isAddrNew,
              setIsAddrNew,
            }}
          />
        )}
      </div>
    </>
  )
}
