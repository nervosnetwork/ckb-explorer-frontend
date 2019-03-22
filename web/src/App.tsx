import React, { useContext, useEffect } from 'react'
import Routers from './routes'
import Loading from './components/Loading'
import Modal from './components/Modal'
import Toast from './components/Toast'

import withProviders from './providers'
import AppContext from './contexts/App'

const App = () => {
  const appContext = useContext(AppContext)
  let resizeListener: any = null
  useEffect(() => {
    resizeListener = () => {
      appContext.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
  }, [])
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Routers />
      <Modal
        onClose={() => {
          appContext.hideModal()
        }}
        data={appContext.modal}
      />
      <Loading
        onClose={() => {
          appContext.hideLoading()
        }}
        data={appContext.loading}
      />
      <Toast
        toastMessage={appContext.toast}
        style={{
          bottom: 5,
        }}
      />
    </div>
  )
}

export default withProviders(App)
