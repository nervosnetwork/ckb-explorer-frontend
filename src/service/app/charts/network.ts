import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import {
  fetchStatisticNewNodeCount,
  fetchStatisticNodeDistribution,
  fetchStatisticBlockPropagationDelayHistory,
} from '../../http/fetcher'

export const getStatisticNewNodeCount = (dispatch: AppDispatch) => {
  fetchStatisticNewNodeCount().then(
    (response: Response.Response<Response.Wrapper<State.StatisticNewNodeCount>[]> | null) => {
      if (!response) return
      const { data } = response
      const statisticNewNodeCounts = data.map(wrapper => {
        return {
          nodesCount: wrapper.attributes.nodesCount ? wrapper.attributes.nodesCount : '0',
          createdAtUnixtimestamp: wrapper.attributes.createdAtUnixtimestamp,
        }
      })
      dispatch({
        type: PageActions.UpdateStatisticNewNodeCount,
        payload: {
          statisticNewNodeCounts,
        },
      })
    },
  )
}

export const getStatisticNodeDistribution = (dispatch: AppDispatch) => {
  fetchStatisticNodeDistribution().then((wrapper: Response.Wrapper<State.StatisticNodeDistributions> | null) => {
    if (!wrapper) return
    const { nodesDistribution } = wrapper.attributes
    let statisticNodeDistributions: State.StatisticNodeDistribution[] = []
    nodesDistribution.forEach(data => {
      statisticNodeDistributions.push({
        name: data.city,
        value: [Number(data.longitude), Number(data.latitude), data.count],
      })
    })
    dispatch({
      type: PageActions.UpdateStatisticNodeDistribution,
      payload: {
        statisticNodeDistributions,
      },
    })
  })
}

export const getStatisticBlockPropagationDelayHistory = (dispatch: AppDispatch) => {
  fetchStatisticBlockPropagationDelayHistory().then(
    (wrapper: Response.Wrapper<State.StatisticBlockPropagationDelayHistories> | null) => {
      if (!wrapper) return
      const { blockPropagationDelayHistory } = wrapper.attributes
      let blockPropagationDelayHistories: State.StatisticBlockPropagationDelayHistory[] = []
      blockPropagationDelayHistory.forEach(data => {
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg5])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg10])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg15])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg20])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg25])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg30])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg35])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg40])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg45])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg50])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg55])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg60])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg65])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg70])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg75])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg80])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg85])
        blockPropagationDelayHistories.push([data.createdAtUnixtimestamp, data.avg90])
      })
      dispatch({
        type: PageActions.UpdateStatisticBlockPropagationDelayHistory,
        payload: {
          statisticBlockPropagationDelayHistories: blockPropagationDelayHistories,
        },
      })
    },
  )
}
