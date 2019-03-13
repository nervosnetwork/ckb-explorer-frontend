import React, { useContext, useEffect } from 'react'
import Routers from './routes'
import Loading from './components/loading'
import Modal from './components/modal'
import Toast from './components/toast'

import withProviders from './providers'
import AppContext from './contexts/app'

const App = () => {
  const appContext = useContext(AppContext)
  let resizeListener: any = null
  useEffect(() => {
    resizeListener = () => {
      appContext.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resizeListener)
    // appContext.toastMessage('hello', 12999933)
    // appContext.showLoading(true, 0, 'red')
    // appContext.showModal(<div>123</div>)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
  }, [])
  return (
    <div
      style={{
        width: appContext.appWidth,
        height: appContext.appHeight,
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
