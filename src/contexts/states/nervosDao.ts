export const initNervosDaoState: State.NervosDaoState = {
  nervosDao: {
    totalDeposit: 0,
    subsidyGranted: 0,
    depositTransactionsCount: 0,
    withdrawTransactionsCount: 0,
    depositorsCount: 0,
    totalDepositorsCount: 0,
    daoTypeHash: '',
  },
  transactions: [],
  total: 0,
  depositors: [],
}

export default initNervosDaoState
