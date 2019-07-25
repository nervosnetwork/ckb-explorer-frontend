export const initApp: State.App = {
  toast: null,
  loading: false,
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
  appLanguage: navigator.language || 'en',
}

export default initApp
