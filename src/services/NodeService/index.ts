import { ccc } from '@ckb-ccc/core'
import { toCamelcase } from '../../utils/util'

export class NodeService {
  nodeEndpoint: string
  public rpc: ccc.Client

  constructor(nodeEndpoint: string) {
    this.nodeEndpoint = nodeEndpoint
    this.rpc = new ccc.ClientPublicMainnet({
      url: nodeEndpoint,
    })
  }

  private async callRpc<T>(method: string, params: unknown[]): Promise<T> {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method,
      params,
    }

    const res = await fetch(this.rpc.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`RPC request failed with status ${res.status}`)
    }

    const json = await res.json()

    if (json.error) {
      throw new Error(`RPC error: ${json.error.code} ${json.error.message}`)
    }

    return toCamelcase(json.result) as T
  }

  // TODO: Switch to ccc when ccc supports this rpc.
  async getBlockEconomicState(blockHash: string) {
    return this.callRpc<CKBComponents.BlockEconomicState>('get_block_economic_state', [blockHash])
  }

  // TODO: Switch to ccc when ccc supports this rpc.
  async getBlockchainInfo() {
    return this.callRpc<CKBComponents.BlockchainInfo>('get_blockchain_info', [])
  }

  // TODO: Switch to ccc when ccc supports this rpc.
  async getConsensus() {
    return this.callRpc<CKBComponents.Consensus>('get_consensus', [])
  }

  async getTx(hash: string) {
    return this.rpc.getTransaction(hash)
  }

  async sendTransaction(tx: ccc.Transaction) {
    return this.rpc.sendTransaction(tx)
  }

  async getCellByOutPoint(outPoint: ccc.OutPointLike): Promise<ccc.Cell | undefined> {
    const res = await this.getTx(outPoint.txHash.toString())

    if (!res) {
      return undefined
    }

    const { transaction } = res

    return ccc.Cell.from({
      cellOutput: transaction.outputs[parseInt(outPoint.index.toString(), 10)],
      outputData: transaction.outputsData[parseInt(outPoint.index.toString(), 10)],
      outPoint,
    })
  }

  async getInputCells(outPoints: ccc.OutPointLike[]): Promise<ccc.Cell[]> {
    const cells = await Promise.all(outPoints.map(outPoint => this.getCellByOutPoint(outPoint)))
    return cells.filter(i => i) as ccc.Cell[]
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

  export type TransactionWithStatus = ccc.ClientTransactionResponse
}
