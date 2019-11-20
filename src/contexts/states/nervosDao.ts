export const initNervosDaoState: State.NervosDaoState = {
  nervosDao: {
    totalDeposit: 0,
    interestGranted: 0,
    depositTransactionsCount: 0,
    withdrawTransactionsCount: 0,
    depositorsCount: 0,
    totalDepositorsCount: 0,
    daoTypeHash: '',
  },
  transactions: [],
  total: 0,
  depositors: [],
  status: 'None',
}

export default initNervosDaoState
