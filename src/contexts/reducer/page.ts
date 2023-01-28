import { PageActions } from '../actions'

export const pageReducer = (
  state: State.AppState,
  { type, payload }: { type: PageActions; payload: State.PagePayload },
): State.AppState => {
  switch (type) {
    // statistic chart page
    case PageActions.UpdateStatistics:
      return {
        ...state,
        statistics: payload.statistics,
      }
    case PageActions.UpdateStatisticTotalDaoDeposit:
      return {
        ...state,
        statisticTotalDaoDeposits: payload.statisticTotalDaoDeposits,
      }
    case PageActions.UpdateStatisticTotalDaoDepositFetchEnd:
      return {
        ...state,
        statisticTotalDaoDepositsFetchEnd: payload.statisticTotalDaoDepositsFetchEnd,
      }
    case PageActions.UpdateStatisticNewDaoDeposit:
      return {
        ...state,
        statisticNewDaoDeposits: payload.statisticNewDaoDeposits,
      }
    case PageActions.UpdateStatisticNewDaoDepositFetchEnd:
      return {
        ...state,
        statisticNewDaoDepositsFetchEnd: payload.statisticNewDaoDepositsFetchEnd,
      }
    case PageActions.UpdateStatisticNewDaoWithdraw:
      return {
        ...state,
        statisticNewDaoWithdraw: payload.statisticNewDaoWithdraw,
      }
    case PageActions.UpdateStatisticNewDaoWithdrawFetchEnd:
      return {
        ...state,
        statisticNewDaoWithdrawFetchEnd: payload.statisticNewDaoWithdrawFetchEnd,
      }
    case PageActions.UpdateStatisticNewNodeCount:
      return {
        ...state,
        statisticNewNodeCounts: payload.statisticNewNodeCounts,
      }
    case PageActions.UpdateStatisticNewNodeCountFetchEnd:
      return {
        ...state,
        statisticNewNodeCountsFetchEnd: payload.statisticNewNodeCountsFetchEnd,
      }
    case PageActions.UpdateStatisticNodeDistribution:
      return {
        ...state,
        statisticNodeDistributions: payload.statisticNodeDistributions,
      }
    case PageActions.UpdateStatisticNodeDistributionFetchEnd:
      return {
        ...state,
        statisticNodeDistributionsFetchEnd: payload.statisticNodeDistributionsFetchEnd,
      }

    default:
      return state
  }
}

export default pageReducer
