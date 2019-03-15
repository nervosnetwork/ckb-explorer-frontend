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
export interface Loading {
  maskTop: number
  maskColor: string
}

export interface App {
  toast: ToastMessage | null
  loading: Loading | null
  modal: Modal | null

  appWidth: number
  appHeight: number
  appLanguage: string

  resize: Function
  toastMessage: Function
  showLoading: Function
  hideLoading: Function
  showModal: Function
  hideModal: Function
}
export const initApp: App = {
  toast: null,
  loading: null,
  modal: null,
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  appLanguage: navigator.language || 'en',

  resize: () => {},
  toastMessage: () => {},
  showLoading: () => {},
  hideLoading: () => {},
  showModal: () => {},
  hideModal: () => {},
}

const AppContext = createContext<App>(initApp)
export default AppContext
