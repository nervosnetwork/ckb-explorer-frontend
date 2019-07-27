import { createContext } from 'react'

export interface ToastMessage {
  text: string
  timeout: number
  id: number
}

export interface Modal {
  ui: React.ComponentType
  maskTop: number
  maskColor: string
}

export interface AppError {
  type: 'Network' | 'ChainAlert' | 'Maintain'
  message: string[]
}

export interface App {
  toast: ToastMessage | null
  show: boolean
  modal: Modal | null
  appErrors: [
    { type: 'Network'; message: string[] },
    { type: 'ChainAlert'; message: string[] },
    { type: 'Maintain'; message: string[] },
  ]
  nodeVersion: string

  appWidth: number
  appHeight: number
  appLanguage: string

  resize: Function
  toastMessage: Function
  showLoading: Function
  hideLoading: Function
  showModal: Function
  hideModal: Function
  updateAppErrors: (appError: AppError) => void
  updateNodeVersion: (version: string) => void
}
export const initApp: App = {
  toast: null,
  show: false,
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
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  appLanguage: navigator.language || 'en',

  resize: () => {},
  toastMessage: () => {},
  showLoading: () => {},
  hideLoading: () => {},
  showModal: () => {},
  hideModal: () => {},
  updateAppErrors: () => {},
  updateNodeVersion: () => {},
}

const AppContext = createContext<App>(initApp)
export default AppContext
