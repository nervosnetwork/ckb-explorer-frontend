export const initNervosDaoState: State.nervosDaoState = {
  nervosDao: {
    totalDeposit: 0,
    subsidyGranted: 0,
    depositTransactionsCount: 0,
    withdrawTransactionsCount: 0,
    depositorsCount: 0,
    totalDepositorsCount: 0,
    daoTypeHash: '',
  },
  transactions: [] as State.Transaction[],
  total: 0,
}

export default initNervosDaoState
