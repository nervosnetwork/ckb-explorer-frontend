import { ccc } from '@ckb-ccc/core'
import { RPC } from '@ckb-lumos/rpc'

export class NodeService {
  nodeEndpoint: string
  public rpc: ccc.Client
  public lumosRPC: RPC

  constructor(nodeEndpoint: string) {
    this.nodeEndpoint = nodeEndpoint
    this.lumosRPC = new RPC(nodeEndpoint)
    this.rpc = new ccc.ClientPublicMainnet({
      url: nodeEndpoint,
    })
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
