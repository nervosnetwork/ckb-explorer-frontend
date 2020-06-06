import React, { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useAppState } from '../../contexts/providers/index'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { formatConfirmation, shannonToCkb, matchTxHash } from '../../utils/util'
import {
  TransactionBlockHeightPanel,
  TransactionInfoItemPanel,
  TransactionInfoContentPanel,
  TransactionOverviewPanel,
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
import { isScreenSmallerThan1440 } from '../../utils/screen'

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

const transactionParamsIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const TransactionInfoComp = ({
  title,
  value,
  linkUrl,
  tag,
}: {
  title?: string
  value: string | ReactNode
  linkUrl?: string
  tag?: ReactNode
}) => {
  return (
    <div className="transaction__info__content_item">
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
    </div>
  )
}

export const TransactionOverview = () => {
  const [showParams, setShowParams] = useState<boolean>(false)
  const {
    transactionState: {
      transaction: { blockNumber, cellDeps, headerDeps, witnesses, blockTimestamp, transactionFee },
    },
    app: { tipBlockNumber },
  } = useAppState()

  let confirmation = 0
  if (tipBlockNumber && blockNumber) {
    confirmation = tipBlockNumber - blockNumber
  }

  const overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: <TransactionBlockHeight blockNumber={blockNumber} />,
    },
    {
      title: i18n.t('block.timestamp'),
      content: parseSimpleDate(blockTimestamp),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(transactionFee))} />,
    },
  ]
  if (confirmation > 0) {
    overviewItems.push({
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    })
  }

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
                <TransactionInfoComp
                  title={i18n.t('transaction.out_point_tx_hash')}
                  value={txHash}
                  linkUrl={`/transaction/${txHash}`}
                  tag={
                    !isScreenSmallerThan1440() &&
                    hashTag && <HashTag content={hashTag.tag} category={hashTag.category} />
                  }
                />
                {isScreenSmallerThan1440() && hashTag && (
                  <TransactionInfoComp value={<HashTag content={hashTag.tag} category={hashTag.category} />} />
                )}
                <TransactionInfoComp title={i18n.t('transaction.out_point_index')} value={index} />
                <TransactionInfoComp title={i18n.t('transaction.dep_type')} value={depType} />
              </TransactionInfoContentPanel>
            )
          })
        ) : (
          <TransactionInfoContentPanel>
            <TransactionInfoComp title="CellDep" value="[ ]" />
          </TransactionInfoContentPanel>
        ),
    },
    {
      title: i18n.t('transaction.header_deps'),
      content:
        headerDeps && headerDeps.length > 0 ? (
          headerDeps.map(headerDep => {
            return (
              <TransactionInfoContentPanel key={headerDep}>
                <TransactionInfoComp
                  title={i18n.t('transaction.header_dep')}
                  value={headerDep}
                  linkUrl={`/block/${headerDep}`}
                />
              </TransactionInfoContentPanel>
            )
          })
        ) : (
          <TransactionInfoContentPanel>
            <TransactionInfoComp title={i18n.t('transaction.header_dep')} value="[ ]" />
          </TransactionInfoContentPanel>
        ),
    },
    {
      title: i18n.t('transaction.witnesses'),
      content:
        witnesses && witnesses.length > 0 ? (
          witnesses.map((witness, index) => {
            return (
              <TransactionInfoContentPanel key={`${witness}-${index}`}>
                <TransactionInfoComp title="Witness" value={witness} />
              </TransactionInfoContentPanel>
            )
          })
        ) : (
          <TransactionInfoContentPanel>
            <TransactionInfoComp title="Witness" value="[ ]" />
          </TransactionInfoContentPanel>
        ),
    },
  ]

  return (
    <TransactionOverviewPanel>
      <OverviewCard items={overviewItems} hideShadow={true}>
        <div className="transaction__overview_info">
          <SimpleButton className="transaction__overview_parameters" onClick={() => setShowParams(!showParams)}>
            <div>{i18n.t('transaction.transaction_parameters')}</div>
            <img alt="transaction parameters" src={transactionParamsIcon(showParams)} />
          </SimpleButton>
          {showParams && (
            <div className="transaction__overview_params">
              {TransactionParams.map(item => {
                return (
                  <TransactionInfoItemPanel key={item.title}>
                    <div className="transaction__info_title">{item.title}</div>
                    <div className="transaction__info_value">{item.content}</div>
                  </TransactionInfoItemPanel>
                )
              })}
            </div>
          )}
        </div>
      </OverviewCard>
    </TransactionOverviewPanel>
  )
}

const handleCellbaseInputs = (inputs: State.Cell[], outputs: State.Cell[]) => {
  if (inputs[0].fromCellbase) {
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

export default () => {
  const {
    transactionState: {
      transaction: { transactionHash, displayInputs, displayOutputs, blockNumber, isCellbase },
    },
  } = useAppState()

  const inputs = handleCellbaseInputs(displayInputs, displayOutputs)

  return (
    <>
      <div className="transaction__inputs">
        {inputs && (
          <TransactionCellList
            inputs={inputs}
            // [0, 11] block doesn't show block reward and only cellbase show block reward
            showReward={blockNumber > 0 && isCellbase}
          />
        )}
      </div>
      <div className="transaction__outputs">
        {displayOutputs && <TransactionCellList outputs={displayOutputs} txHash={transactionHash} />}
      </div>
    </>
  )
}
