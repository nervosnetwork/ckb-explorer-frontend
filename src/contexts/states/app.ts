import { getChartColor, getPrimaryColor, getSecondaryColor } from '../../constants/common'

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
  hasFinishedHardFork: false,
  primaryColor: getPrimaryColor(false),
  secondaryColor: getSecondaryColor(false),
  chartColor: getChartColor(false),
}

export default initApp
