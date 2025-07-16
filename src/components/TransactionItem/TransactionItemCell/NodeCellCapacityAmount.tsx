import type { Cell } from '@ckb-ccc/core'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { parseUDTAmount } from '../../../utils/number'
import { shannonToCkb } from '../../../utils/util'
import { explorerService } from '../../../services/ExplorerService'
import { UDT_CELL_TYPES, getCellType, getUDTAmountByData } from '../../../utils/cell'
import Capacity from '../../Capacity'

export const NodeCellCapacityAmount = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  const { type: cellType } = getCellType(cell)
  const isUDTCell = UDT_CELL_TYPES.findIndex(type => type === cellType) !== -1
  const udtTypeHash = isUDTCell ? cell.cellOutput.type?.hash() : undefined
  const udtInfo = useQuery(
    ['udt', udtTypeHash],
    () => {
      if (!udtTypeHash) return undefined
      return explorerService.api.fetchSimpleUDT(udtTypeHash)
    },
    {
      enabled: isUDTCell,
      staleTime: Infinity,
    },
  )

  if (isUDTCell && udtTypeHash && udtInfo.data) {
    const amount = getUDTAmountByData(cell.outputData)
    if (cellType === 'udt' && udtInfo.data.published) {
      return <span>{`${parseUDTAmount(amount, udtInfo.data.decimal)} ${udtInfo.data.symbol}`}</span>
    }

    if (cellType === 'xudt' && udtInfo.data.decimal && udtInfo.data.symbol) {
      return <span>{`${parseUDTAmount(amount, udtInfo.data.decimal)} ${udtInfo.data.symbol}`}</span>
    }

    return <span>{`${t('udt.unknown_token')} #${udtTypeHash.substring(udtTypeHash.length - 4)}`}</span>
  }

  if (isUDTCell && udtTypeHash) {
    return <span>{`${t('udt.unknown_token')} #${udtTypeHash.substring(udtTypeHash.length - 4)}`}</span>
  }

  return <Capacity capacity={shannonToCkb(cell.cellOutput.capacity.toString())} layout="responsive" />
}
