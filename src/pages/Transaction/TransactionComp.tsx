/* eslint-disable react/no-array-index-key */
import { useState, ReactNode, FC } from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Trans, useTranslation } from 'react-i18next'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { parseSimpleDate } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { useFormatConfirmation, shannonToCkb, matchTxHash } from '../../utils/util'
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
import { isMainnet } from '../../utils/chain'
import SimpleButton from '../../components/SimpleButton'
import HashTag from '../../components/HashTag'
import { useAddrFormatToggle } from '../../utils/hook'
import ComparedToMaxTooltip from '../../components/Tooltip/ComparedToMaxTooltip'
import { HelpTip } from '../../components/HelpTip'
import { useLatestBlockNumber } from '../../services/ExplorerService'

const showTxStatus = (txStatus: string) => txStatus?.replace(/^\S/, s => s.toUpperCase()) ?? '-'

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
  tooltip,
  value,
  valueTooltip,
  linkUrl,
  tag,
}: {
  title?: string
  tooltip?: string
  value: string | ReactNode
  valueTooltip?: string
  linkUrl?: string
  tag?: ReactNode
}) => (
  <TransactionInfoContentItem>
    <div className="transactionInfoContentTitle">
      {title ? (
        <>
          <span>{title}</span>
          {tooltip && <HelpTip title={tooltip} />}
          <span>:</span>
        </>
      ) : (
        ''
      )}
    </div>
    <div className="transactionInfoContentContainer monospace">
      <div className="transactionInfoContentValue">
        {linkUrl ? (
          <Link to={linkUrl} className="monospace">
            {value}
          </Link>
        ) : (
          value
        )}
        {valueTooltip && <HelpTip title={valueTooltip} />}
      </div>
      {tag && <div className="transactionInfoContentTag">{tag}</div>}
    </div>
  </TransactionInfoContentItem>
)

const TransactionInfoItemWrapper = ({
  title,
  tooltip,
  value,
  linkUrl,
}: {
  title?: string
  tooltip?: string
  value: string | ReactNode
  linkUrl?: string
}) => (
  <TransactionInfoContentPanel>
    <TransactionInfoItem title={title} tooltip={tooltip} value={value} linkUrl={linkUrl} />
  </TransactionInfoContentPanel>
)

export const TransactionOverview: FC<{ transaction: State.Transaction }> = ({ transaction }) => {
  const [showParams, setShowParams] = useState<boolean>(false)
  const tipBlockNumber = useLatestBlockNumber()
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
  const { t } = useTranslation()
  const parseFormatConfirmation = useFormatConfirmation()
  let confirmation = 0
  if (tipBlockNumber && blockNumber) {
    confirmation = tipBlockNumber - blockNumber
  }

  const OverviewItems: Array<OverviewItemData> = [
    {
      title: t('block.block_height'),
      tooltip: t('glossary.block_height'),
      content: <TransactionBlockHeight blockNumber={blockNumber} txStatus={txStatus} />,
    },
  ]
  if (txStatus === 'committed') {
    if (confirmation >= 0) {
      OverviewItems.push(
        {
          title: t('block.timestamp'),
          tooltip: t('glossary.timestamp'),
          content: parseSimpleDate(blockTimestamp),
        },
        bytes
          ? {
              title: `${t('transaction.transaction_fee')} | ${t('transaction.fee_rate')}`,
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
              title: t('transaction.transaction_fee'),
              content: <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />,
            },

        {
          title: t('transaction.status'),
          tooltip: t('glossary.transaction_status'),
          content: parseFormatConfirmation(confirmation),
        },
      )
    }
  } else {
    OverviewItems.push(
      {
        title: t('block.timestamp'),
        tooltip: t('glossary.timestamp'),
        content: showTxStatus(txStatus),
      },
      {
        title: t('transaction.transaction_fee'),
        content: <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />,
      },
      {
        title: t('transaction.status'),
        tooltip: t('glossary.transaction_status'),
        content: showTxStatus(txStatus),
        valueTooltip: txStatus === 'rejected' ? detailedMessage : undefined,
      },
    )
  }

  OverviewItems.push(
    {
      title: t('transaction.size'),
      content: bytes ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${(bytes - 4).toLocaleString('en')} Bytes`}
          <ComparedToMaxTooltip
            numerator={bytes}
            maxInEpoch={largestTxInEpoch}
            maxInChain={largestTx}
            titleInEpoch={t('transaction.compared_to_the_max_size_in_epoch')}
            titleInChain={t('transaction.compared_to_the_max_size_in_chain')}
            unit="Bytes"
          >
            {t('transaction.size_in_block', {
              bytes: bytes.toLocaleString('en'),
            })}
          </ComparedToMaxTooltip>
        </div>
      ) : (
        ''
      ),
    },
    null,
    {
      title: t('transaction.cycles'),
      content: cycles ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${cycles.toLocaleString('en')}`}
          <ComparedToMaxTooltip
            numerator={cycles}
            maxInEpoch={maxCyclesInEpoch}
            maxInChain={maxCycles}
            titleInEpoch={t('transaction.compared_to_the_max_cycles_in_epoch')}
            titleInChain={t('transaction.compared_to_the_max_cycles_in_chain')}
          />
        </div>
      ) : (
        '-'
      ),
    },
  )

  const TransactionParams = [
    {
      title: t('transaction.cell_deps'),
      tooltip: (
        <Trans
          i18nKey="glossary.cell_deps"
          components={{
            link1: (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
              <a
                href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#code-locating"
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      ),
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
                  title={t('transaction.out_point_tx_hash')}
                  tooltip={t('glossary.out_point_tx_hash')}
                  value={txHash}
                  linkUrl={`/transaction/${txHash}`}
                  tag={hashTag && <HashTag content={hashTag.tag} category={hashTag.category} />}
                />
                <TransactionInfoItem
                  title={t('transaction.out_point_index')}
                  tooltip={t('glossary.out_point_index')}
                  value={index}
                />
                <TransactionInfoItem
                  title={t('transaction.dep_type')}
                  tooltip={t('glossary.dep_type')}
                  value={depType}
                  valueTooltip={depType === 'dep_group' ? t('glossary.dep_group') : undefined}
                />
              </TransactionInfoContentPanel>
            )
          })
        ) : (
          <TransactionInfoItemWrapper title="CellDep" value="[ ]" />
        ),
    },
    {
      title: t('transaction.header_deps'),
      tooltip: t('glossary.header_deps'),
      content:
        headerDeps && headerDeps.length > 0 ? (
          headerDeps.map(headerDep => (
            <TransactionInfoItemWrapper
              key={headerDep}
              title={t('transaction.header_dep')}
              value={headerDep}
              linkUrl={`/block/${headerDep}`}
            />
          ))
        ) : (
          <TransactionInfoItemWrapper title={t('transaction.header_dep')} value="[ ]" />
        ),
    },
    {
      title: t('transaction.witnesses'),
      tooltip: t('glossary.witnesses'),
      content:
        witnesses && witnesses.length > 0 ? (
          witnesses.map((witness, index) => (
            <TransactionInfoItemWrapper
              key={`${witness}-${index}`}
              title="Witness"
              tooltip={t('glossary.witness')}
              value={witness}
            />
          ))
        ) : (
          <TransactionInfoItemWrapper title="Witness" tooltip={t('glossary.witness')} value="[ ]" />
        ),
    },
  ]

  return (
    <TransactionOverviewPanel>
      <OverviewCard items={OverviewItems} hideShadow>
        <div className="transactionOverviewInfo">
          <SimpleButton className="transactionOverviewParameters" onClick={() => setShowParams(!showParams)}>
            <div>{t('transaction.transaction_parameters')}</div>
            <img alt="transaction parameters" src={transactionParamsIcon(showParams)} />
          </SimpleButton>
          {showParams && (
            <div className="transactionOverviewParams">
              {TransactionParams.map(item => (
                <TransactionInfoItemPanel key={item.title}>
                  <div className="transactionInfoTitle">
                    <span>{item.title}</span>
                    {item.tooltip && <HelpTip title={item.tooltip} />}
                  </div>
                  <div className="transactionInfoValue">{item.content}</div>
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
  const { transactionHash, displayInputs, displayOutputs, blockNumber, isCellbase } = transaction

  const { isNew: isAddrNew, setIsNew: setIsAddrNew } = useAddrFormatToggle()
  const inputs = handleCellbaseInputs(displayInputs, displayOutputs)

  /// [0, 11] block doesn't show block reward and only cellbase show block reward
  return (
    <>
      <div className="transactionInputs">
        {inputs && (
          <TransactionCellList
            inputs={inputs}
            showReward={blockNumber > 0 && isCellbase}
            addrToggle={{
              isAddrNew,
              setIsAddrNew,
            }}
          />
        )}
      </div>
      <div className="transactionOutputs">
        {displayOutputs && (
          <TransactionCellList
            outputs={displayOutputs}
            txHash={transactionHash}
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
