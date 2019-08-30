import React, { useState, useCallback } from 'react'
import { CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import TransactionCell from '../TransactionCell'
import { TransactionCellListPanel, TransactionCellListTitlePanel, TransactionCellsPanel } from './styled'
import { AppDispatch } from '../../../contexts/providers/reducer'
import SmallLoading from '../../../components/Loading/SmallLoading'

const PAGE_CELL_COUNT = 200
const SCROLL_BOTTOM_OFFSET = 5
const SCROLL_LOADING_TIME = 400

export default ({
  inputs,
  outputs,
  dispatch,
}: {
  inputs?: State.Cell[]
  outputs?: State.Cell[]
  dispatch: AppDispatch
}) => {
  const [offset, setOffset] = useState(PAGE_CELL_COUNT)
  const [isEnd, setIsEnd] = useState(false)
  const cells = inputs || outputs || []
  const hideCapacityTitle = inputs && inputs.length > 0 && inputs[0].fromCellbase
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

  return (
    <TransactionCellListPanel>
      <TransactionCellListTitlePanel>
        <div className="transaction__cell_list_titles">
          <span>{inputs ? i18n.t('transaction.input') : i18n.t('transaction.output')}</span>
          <span>{hideCapacityTitle ? '' : i18n.t('transaction.capacity')}</span>
          <span>{i18n.t('transaction.detail')}</span>
        </div>
      </TransactionCellListTitlePanel>
      <TransactionCellsPanel isScroll={isScroll}>
        <div className="transaction__cell_list_container" onScroll={(event: any) => handleScroll(event)}>
          {cells &&
            cells
              .slice(0, offset)
              .map(cell => (
                <TransactionCell
                  key={cell.id}
                  cell={cell}
                  cellType={inputs ? CellType.Input : CellType.Output}
                  dispatch={dispatch}
                />
              ))}
          {isScroll && !isEnd && <SmallLoading />}
        </div>
      </TransactionCellsPanel>
    </TransactionCellListPanel>
  )
}
