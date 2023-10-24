import { useState, useCallback } from 'react'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { CellType, PAGE_CELL_COUNT } from '../../../constants/common'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel, TransactionCellsPanel } from './styled'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { ReactComponent as DeprecatedAddrOn } from '../../../assets/deprecated_addr_on.svg'
import { ReactComponent as DeprecatedAddrOff } from '../../../assets/deprecated_addr_off.svg'
import { ReactComponent as Warning } from '../../../assets/warning.svg'
import styles from './styles.module.scss'

const SCROLL_BOTTOM_OFFSET = 5
const SCROLL_LOADING_TIME = 400

export default ({
  inputs,
  outputs,
  txHash,
  showReward,
  addrToggle: { isAddrNew, setIsAddrNew },
}: {
  inputs?: State.Cell[]
  outputs?: State.Cell[]
  txHash?: string
  showReward?: boolean
  addrToggle: {
    isAddrNew: boolean
    setIsAddrNew: (is: boolean) => void
  }
}) => {
  const { t } = useTranslation()
  const [offset, setOffset] = useState(PAGE_CELL_COUNT)
  const [isEnd, setIsEnd] = useState(false)
  const cells = inputs || outputs || []
  const isCellbaseInput = inputs && inputs.length > 0 && inputs[0].fromCellbase
  const isScroll = cells.length > PAGE_CELL_COUNT

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (cells.length <= offset) {
        setIsEnd(true)
        return
      }
      const element = event.target as HTMLDivElement
      const { scrollHeight, scrollTop, offsetHeight } = element
      if (scrollHeight - scrollTop - offsetHeight < SCROLL_BOTTOM_OFFSET) {
        setTimeout(() => {
          setOffset(offset + PAGE_CELL_COUNT)
        }, SCROLL_LOADING_TIME)
      }
    },
    [offset, cells.length],
  )

  const handleAddrToggle = () => {
    setIsAddrNew(!isAddrNew)
  }

  const cellsCount = () => {
    if (inputs) {
      return inputs.length
    }
    return outputs ? outputs.length : 0
  }

  const cellTitle = () => {
    const title = inputs ? t('transaction.input') : t('transaction.output')
    return (
      <div className={styles.cellListTitle}>
        {`${title} (${cellsCount()})`}
        <Tooltip placement="top" title={t(`address.view-deprecated-address`)}>
          <div className={styles.newAddrToggle} onClick={handleAddrToggle} role="presentation">
            {isAddrNew ? <DeprecatedAddrOff /> : <DeprecatedAddrOn />}
          </div>
        </Tooltip>
        {isAddrNew ? null : (
          <Tooltip placement="top" title={t('address.displaying-deprecated-address')}>
            <Warning />
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transactionCellListTitles">
          <div>{cellTitle()}</div>
          <div>{isCellbaseInput ? t('transaction.reward_info') : t('transaction.detail')}</div>
          <div>{isCellbaseInput ? '' : t('transaction.capacity_amount')}</div>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCellsPanel isScroll={isScroll}>
        <div className="transactionCellTitle">{cellTitle()}</div>
        <div className="transactionCellListContainer" onScroll={event => handleScroll(event)}>
          {cells &&
            cells
              .slice(0, offset)
              .map((cell, index) => (
                <TransactionCell
                  key={cell.id}
                  cell={cell}
                  cellType={inputs ? CellType.Input : CellType.Output}
                  index={index}
                  txHash={txHash}
                  showReward={showReward}
                  isAddrNew={isAddrNew}
                />
              ))}
          {isScroll && !isEnd && <SmallLoading />}
        </div>
      </TransactionCellsPanel>
    </TransactionCellListPanel>
  )
}
