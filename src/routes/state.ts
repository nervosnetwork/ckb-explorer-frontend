export interface RouteState$BlockListPage {
  type: 'BlockListPage'
  createTime: number
  blocksDataWithFirstPage: {
    blocks: State.Block[]
    total: number
    pageSize?: number
  }
}

export interface RouteState$TransactionListPage {
  type: 'TransactionListPage'
  createTime: number
  transactionsDataWithFirstPage: {
    transactions: State.Transaction[]
    total: number
  }
}

export type RouteState =
  | RouteState$BlockListPage
  | RouteState$TransactionListPage
  // Since the State property of the Location interface in `history/index.d.ts` is set to always exist,
  // but may actually be undefined, it is necessary here to actively provide a empty value to the generic
  | undefined
