import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from '@ckb-lumos/base'
import styles from './styles.module.scss'
import { useParsedDate } from '../../hooks'
import { ReactComponent as DirectionIcon } from '../../assets/direction.svg'
import NodeTransactionItemCell from './TransactionItemCell/NodeTransactionItemCell'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import TransactionCellListPanel from './TransactionItemCellList/styled'
import { localeNumberString, isBlockNumber } from '../../utils/number'
import { getTransactionOutputCells, checkIsCellBase } from '../../utils/transaction'
import Loading from '../Loading'
import AddressText from '../AddressText'
import { useCKBNode } from '../../hooks/useCKBNode'
import Cellbase from '../Transaction/Cellbase'
import { IOType } from '../../constants/common'

const NodeTransactionItem = ({
  transaction,
  blockHashOrNumber,
  highlightAddress,
  showBlock = true,
}: {
  transaction: Transaction
  blockHashOrNumber?: string
  highlightAddress?: string
  showBlock?: boolean
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { nodeService } = useCKBNode()

  const { data: inputCells = [], isFetching: isInputsLoading } = useQuery(
    ['node', 'inputCells', transaction!.hash],
    () => nodeService.getInputCells(transaction.inputs),
  )

  const { data: blockHeader } = useQuery(
    ['node', 'header', blockHashOrNumber],
    () => {
      if (!blockHashOrNumber) return null

      return isBlockNumber(blockHashOrNumber)
        ? nodeService.rpc.getHeaderByNumber(`0x${parseInt(blockHashOrNumber, 10).toString(16)}`)
        : nodeService.rpc.getHeader(blockHashOrNumber)
    },
    {
      enabled: !!blockHashOrNumber,
    },
  )

  const localTime = useParsedDate(blockHeader?.timestamp ?? 0)

  const outputCells = getTransactionOutputCells(transaction)

  return (
    <>
      <TransactionPanel ref={ref} circleCorner={{}}>
        <TransactionHashBlockPanel>
          <div className="transactionItemContent">
            <div className={styles.left}>
              <AddressText
                disableTooltip
                className="transactionItemHash"
                linkProps={{
                  to: `/transaction/${transaction.hash!}`,
                }}
              >
                {transaction.hash!}
              </AddressText>
            </div>
            {blockHashOrNumber && blockHeader && showBlock && (
              <div className={styles.right}>
                <time dateTime={localTime} className="transactionItemBlock">
                  {`(${t('block.block')} ${localeNumberString(parseInt(blockHeader.number, 16))}) ${localTime}`}
                </time>
              </div>
            )}
          </div>
        </TransactionHashBlockPanel>
        <TransactionCellPanel>
          <div className="transactionItemInput">
            <TransactionCellListPanel>
              {checkIsCellBase(transaction) ? (
                <Cellbase cell={blockHeader ? { targetBlockNumber: parseInt(blockHeader.number, 16) - 11 } : {}} />
              ) : null}
              <Loading show={isInputsLoading} />
              {inputCells.map(cell => (
                <NodeTransactionItemCell
                  cell={cell}
                  key={`${cell.outPoint?.txHash!}-${cell.outPoint?.index}`}
                  ioType={IOType.Input}
                  highlightAddress={highlightAddress}
                />
              ))}
            </TransactionCellListPanel>
          </div>
          <DirectionIcon className={styles.direction} />
          <div className="transactionItemOutput">
            {outputCells.length !== 0 ? (
              <TransactionCellListPanel>
                {outputCells.map((cell, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <FullPanel key={index}>
                    <NodeTransactionItemCell cell={cell} ioType={IOType.Output} highlightAddress={highlightAddress} />
                  </FullPanel>
                ))}
              </TransactionCellListPanel>
            ) : (
              <div className="transactionItemOutputEmpty">{t('transaction.empty_output')}</div>
            )}
          </div>
        </TransactionCellPanel>
      </TransactionPanel>
    </>
  )
}

export default NodeTransactionItem
