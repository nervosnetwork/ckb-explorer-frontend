import axios from 'axios'
import config from '../../config'

const { BACKUP_NODES: backupNodes } = config

const node = backupNodes[0]

if (!node) {
  throw new Error('NodeService not implemented')
}

export const getTx = async (hash: string): Promise<{ result: { transaction: NodeRpc.RawTransaction | null } }> => {
  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_transaction',
    params: [hash],
  }

  return axios
    .post(node, body)
    .then(res => res.data)
    .catch(() => null)
}

namespace NodeRpc {
  interface Script {
    code_hash: string
    args: string
    hash_type: 'data' | 'type' | 'data1' | 'data2'
  }

  interface CellDep {
    out_point: {
      tx_hash: string
      index: string
    }
    dep_type: string
  }

  interface CellInput {
    previous_output: {
      tx_hash: string
      index: string
    }
    since: string
  }

  interface CellOutput {
    capacity: string
    lock: Script
    type: Script | null
  }
  export interface RawTransaction {
    version: string
    cell_deps: CellDep[]
    header_deps: string[]
    inputs: CellInput[]
    outputs: CellOutput[]
    witnesses: string[]
    outputs_data: string[]
  }
}
