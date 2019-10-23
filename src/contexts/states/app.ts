export const initApp: State.App = {
  toast: null,
  loading: false,
  secondLoading: false,
  modal: null,
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
      type: 'Maintain',
      message: [],
    },
  ],
  nodeVersion: '',
  tipBlockNumber: 0,
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  language: navigator.language.includes('zh') ? 'zh' : 'en',
  chainType: 'ckb_test',
}

export default initApp
