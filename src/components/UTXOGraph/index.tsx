import { useCallback, useState } from 'react'
import { TxGraph, type UXTOTxGraph } from './txGraph'
import { CellGraph } from './cellGraph'
import { CellBasicInfo } from '../../utils/transformer'

type UTXOGraphProps = (CellBasicInfo | UXTOTxGraph) & {
  modalRef?: HTMLDivElement | null
  onViewCell: (cell: CellBasicInfo) => void
}

export default (props: UTXOGraphProps) => {
  const [viewInfo, setViewInfo] = useState<UXTOTxGraph | CellBasicInfo | undefined>()
  const onViewTxGraph = useCallback((txHash: string) => {
    setViewInfo({ txHash })
  }, [])
  const onViewCellGraph = useCallback((param: CellBasicInfo) => {
    setViewInfo(param)
  }, [])
  const { modalRef, onViewCell, ...otherProps } = props
  const currentViewInfo = viewInfo ?? otherProps
  if ('txHash' in currentViewInfo) {
    return (
      <TxGraph
        txHash={currentViewInfo.txHash}
        onViewCellGraph={onViewCellGraph}
        modalRef={modalRef}
        onViewCell={onViewCell}
      />
    )
  }
  return <CellGraph {...currentViewInfo} onViewTxGraph={onViewTxGraph} modalRef={modalRef} onViewCell={onViewCell} />
}
