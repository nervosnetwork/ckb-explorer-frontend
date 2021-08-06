import { useState, useCallback } from 'react'
import { CellType, PAGE_CELL_COUNT } from '../../../constants/common'
import i18n from '../../../utils/i18n'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel, TransactionCellsPanel } from './styled'
import SmallLoading from '../../../components/Loading/SmallLoading'

const SCROLL_BOTTOM_OFFSET = 5
const SCROLL_LOADING_TIME = 400

export default ({
  inputs,
  outputs,
  txHash,
  showReward,
  txStatus,
}: {
  inputs?: State.Cell[]
  outputs?: State.Cell[]
  txHash?: string
  showReward?: boolean
  txStatus: string
}) => {
  const [offset, setOffset] = useState(PAGE_CELL_COUNT)
  const [isEnd, setIsEnd] = useState(false)
  const cells = inputs || outputs || []
  const isCellbaseInput = inputs && inputs.length > 0 && inputs[0].fromCellbase
  const isScroll = cells.length > PAGE_CELL_COUNT

  const handleScroll = useCallback(
    (event: Event) => {
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

  const cellsCount = () => {
    if (inputs) {
      return inputs.length
    }
    return outputs ? outputs.length : 0
  }

  const cellTitle = () => {
    const title = inputs ? i18n.t('transaction.input') : i18n.t('transaction.output')
    return `${title} (${cellsCount()})`
  }

  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <div>{cellTitle()}</div>
          <div>{isCellbaseInput ? i18n.t('transaction.reward_info') : i18n.t('transaction.detail')}</div>
          <div>{isCellbaseInput ? '' : i18n.t('transaction.capacity_amount')}</div>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCellsPanel isScroll={isScroll}>
        <div className="transaction__cell__title">{cellTitle()}</div>
        <div className="transaction__cell_list_container" onScroll={(event: any) => handleScroll(event)}>
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
                  txStatus={txStatus}
                />
              ))}
          {isScroll && !isEnd && <SmallLoading />}
        </div>
      </TransactionCellsPanel>
    </TransactionCellListPanel>
  )
}
