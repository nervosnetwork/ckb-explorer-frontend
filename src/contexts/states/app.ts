import { ChartColor, getPrimaryColor, getSecondaryColor } from '../../constants/common'

export const initApp: State.App = {
  toast: null,
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
  tipBlockNumber: 0,
  language: navigator.language.includes('zh') ? 'zh' : 'en',
  primaryColor: getPrimaryColor(),
  secondaryColor: getSecondaryColor(),
  chartColor: ChartColor,
}

export default initApp
