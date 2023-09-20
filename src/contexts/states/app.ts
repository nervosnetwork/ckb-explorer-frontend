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
  language: navigator.language.includes('zh') ? 'zh' : 'en',
}

export default initApp
