import { ScriptState } from '../../../utils/const'

export const initCell: Components.Cell = {
  scriptState: ScriptState.NONE,
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
