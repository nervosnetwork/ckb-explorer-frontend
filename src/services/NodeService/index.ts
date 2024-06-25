import axios from 'axios'
import { Input, Cell, OutPoint } from '@ckb-lumos/base'
import { RPC, ResultFormatter } from '@ckb-lumos/rpc'
import { outputToCell } from '../../utils/transaction'

export class NodeService {
  nodeEndpoint: string
  public rpc: RPC

  constructor(nodeEndpoint: string) {
    this.nodeEndpoint = nodeEndpoint
    this.rpc = new RPC(nodeEndpoint)
  }

  async getTx(hash: string): Promise<{
    result: NodeRpc.TransactionWithStatus
  }> {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_transaction',
      params: [hash],
    }

    return axios
      .post(this.nodeEndpoint, body)
      .then(res => res.data)
      .catch(() => null)
  }

  async sendTransaction(tx: NodeRpc.RawTransaction) {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: 'send_transaction',
      params: [tx, 'passthrough'],
    }

    return axios.post(this.nodeEndpoint, body).then(res => res.data)
  }

  async getCellByOutPoint(outPoint: OutPoint): Promise<Cell | undefined> {
    const {
      result: { transaction: rawTransaction, tx_status: txStatus },
    } = await this.getTx(outPoint.txHash)
    if (!rawTransaction) {
      return undefined
    }

    const transaction = ResultFormatter.toTransaction(rawTransaction)
    const index = parseInt(outPoint.index, 16)

    const status =
      txStatus.status === 'committed'
        ? {
            blockHash: txStatus.block_hash,
            blockNumber: txStatus.block_number,
          }
        : {}

    const { blockHash, blockNumber } = status

    return outputToCell(transaction.outputs[index], transaction.outputsData[index], {
      outPoint,
      blockHash,
      blockNumber,
    })
  }

  async getInputCells(inputs: Input[]): Promise<Cell[]> {
    const cells = await Promise.all(inputs.map(input => this.getCellByOutPoint(input.previousOutput)))
    return cells.filter(i => i) as Cell[]
  }
}

export namespace NodeRpc {
  export enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
    Unknown = 'unknown',
    Rejected = 'rejected',
  }

  export interface TransactionWithStatus {
    time_added_to_pool: string | null
    cycles: string | null
    fee: string | null
    min_replace_fee: string | null
    transaction: NodeRpc.RawTransaction | null
    tx_status:
      | {
          block_hash: string
          block_number: string
          status: NodeRpc.TransactionStatus.Committed
        }
      | {
          block_hash: null
          block_number: null
          reason?: string
          status:
            | NodeRpc.TransactionStatus.Pending
            | NodeRpc.TransactionStatus.Proposed
            | NodeRpc.TransactionStatus.Unknown
            | NodeRpc.TransactionStatus.Rejected
        }
  }

  interface Script {
    code_hash: string
    args: string
    hash_type: 'data' | 'type' | 'data1' | 'data2'
  }

  type DepType = 'code' | 'dep_group'

  interface CellDep {
    out_point: {
      tx_hash: string
      index: string
    }
    dep_type: DepType
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
    type?: Script | undefined
  }
  export interface RawTransaction {
    hash: string
    version: string
    cell_deps: CellDep[]
    header_deps: string[]
    inputs: CellInput[]
    outputs: CellOutput[]
    witnesses: string[]
    outputs_data: string[]
  }
}
