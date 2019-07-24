import { CellState } from '../../../utils/const'

export const initCell: Components.Cell = {
  cellState: CellState.NONE,
  lock: {
    code_hash: '',
    args: [],
  },
  type: {
    code_hash: '',
    args: [],
  },
  data: {
    data: '',
  },
}

export default initCell
