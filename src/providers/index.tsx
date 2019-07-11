import React, { useState } from 'react'
import AppContext, { initApp } from '../contexts/App'
import i18n from '../utils/i18n'

const withProviders = (Comp: React.ComponentType) => (props: React.Props<any>) => {
  const [app, setApp] = useState(initApp)
  const appValue = {
    ...app,
    errorMessage: i18n.t('error.maintenance'),
    resize: (appWidth: number, appHeight: number) => {
      setApp((state: any) => {
        return {
          ...state,
          appWidth,
          appHeight,
        }
      })
    },
    showLoading: () => {
      setApp((state: any) => {
        return {
          ...state,
          show: true,
        }
      })
    },
    hideLoading: () => {
      setApp((state: any) => {
        return {
          ...state,
          show: false,
        }
      })
    },
    showModal: (ui: any, uiProps: any) => {
      setApp((state: any) => {
        return {
          ...state,
          modal: {
            ui,
            uiProps,
          },
        }
      })
    },
    hideModal: () => {
      setApp((state: any) => {
        const newApp = {
          ...state,
        }
        delete newApp.modal
        return newApp
      })
    },
    toastMessage: (text: string, timeout: number = 2000) => {
      setApp((state: any) => {
        return {
          ...state,
          toast: {
            id: new Date().getTime(),
            text,
            timeout,
          },
        }
      })
    },
  }
  return (
    <AppContext.Provider value={appValue}>
      <Comp {...props} />
    </AppContext.Provider>
  )
}

export default withProviders
