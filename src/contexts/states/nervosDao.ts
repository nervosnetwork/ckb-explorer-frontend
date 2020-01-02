export const initNervosDaoState: State.NervosDaoState = {
  nervosDao: {
    totalDeposit: '',
    depositorsCount: '',
    depositChanges: '',
    unclaimedCompensationChanges: '',
    claimedCompensationChanges: '',
    depositorChanges: '',
    unclaimedCompensation: '',
    claimedCompensation: '',
    averageDepositTime: '',
    miningReward: '',
    depositCompensation: '',
    treasuryAmount: '',
    estimatedApc: '',
  },
  transactions: [],
  total: 0,
  depositors: [],
  status: 'None',
}

export default initNervosDaoState
