import { AppCachedKeys } from '../../constants/cache'
import { getChartColor, getPrimaryColor, getSecondaryColor, DEPLOY_TIME_LEFT } from '../../constants/common'
import { fetchCachedData } from '../../utils/cache'

const hardForkInfo = fetchCachedData(AppCachedKeys.HardForkInfo) as any

export const initApp: State.App = {
  toast: null,
  loading: false,
  secondLoading: false,
  appErrors: [
    {
      type: 'Network',
      message: [],
    },
    {
      type: 'ChainAlert',
      message: [],
    },
    {
      type: 'Maintenance',
      message: [],
    },
  ],
  nodeVersion: '',
  tipBlockNumber: 0,
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  language: navigator.language.includes('zh') ? 'zh' : 'en',
  miranaHardForkSecondsLeft: hardForkInfo?.miranaHardForkSecondsLeft || DEPLOY_TIME_LEFT,
  hasFinishedHardFork: !!hardForkInfo?.hasFinishedHardFork,
  primaryColor: getPrimaryColor(!!hardForkInfo?.hasFinishedHardFork),
  secondaryColor: getSecondaryColor(!!hardForkInfo?.hasFinishedHardFork),
  chartColor: getChartColor(!!hardForkInfo?.hasFinishedHardFork),
}

export default initApp
