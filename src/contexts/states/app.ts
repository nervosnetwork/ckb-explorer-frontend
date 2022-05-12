import { ChartColor, getPrimaryColor, getSecondaryColor } from '../../constants/common'

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
  primaryColor: getPrimaryColor(),
  secondaryColor: getSecondaryColor(),
  chartColor: ChartColor,
}

export default initApp
