import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from '@ckb-lumos/base'
import styles from './styles.module.scss'
import { ReactComponent as DirectionIcon } from '../../assets/direction.svg'
import NodeTransactionItemCell from './TransactionItemCell/NodeTransactionItemCell'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import TransactionCellListPanel from './TransactionItemCellList/styled'
import { getTransactionOutputCells, checkIsCellBase } from '../../utils/transaction'
import Loading from '../Loading'
import AddressText from '../AddressText'
import { useCKBNode } from '../../hooks/useCKBNode'
import Cellbase from '../Transaction/Cellbase'

const NodeTransactionItem = ({ transaction, blockNumber }: { transaction: Transaction; blockNumber?: number }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { nodeService } = useCKBNode()

  const { data: inputCells = [], isFetching: isInputsLoading } = useQuery(
    ['node', 'inputCells', transaction!.hash],
    () => nodeService.getInputCells(transaction.inputs),
  )

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
          </div>
        </TransactionHashBlockPanel>
        <TransactionCellPanel>
          <div className="transactionItemInput">
            <TransactionCellListPanel>
              {checkIsCellBase(transaction) ? (
                <Cellbase cell={blockNumber ? { targetBlockNumber: blockNumber - 11 } : {}} />
              ) : null}
              <Loading show={isInputsLoading} />
              {inputCells.map((cell, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <NodeTransactionItemCell cell={cell} key={index} />
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
                    <NodeTransactionItemCell cell={cell} />
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
