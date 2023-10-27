import { APIReturn } from '../../services/ExplorerService'

export const defaultNervosDaoInfo: APIReturn<'fetchNervosDao'> = {
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
}
