import React, { useContext, useEffect, useReducer } from 'react'
import styled from 'styled-components'
import Routers from './routes'
import Loading from './components/Loading'
import Modal from './components/Modal'
import Toast from './components/Toast'
import withProviders from './providers'
import AppContext from './contexts/App'
import { axiosIns, fetchBlockchainInfo } from './http/fetcher'
import browserHistory from './routes/history'
import { BLOCKCHAIN_ALERT_POLLING_TIME } from './utils/const'

import { BlockchainInfoWrapper } from './http/response/BlockchainInfo'
import i18n from './utils/i18n'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const RESIZE_LATENCY = 500
let resizeTimer: any = null

const NetworkError = i18n.t('toast.invalid_network')

const alertNotEmpty = (response: BlockchainInfoWrapper): boolean => {
  return (
    response &&
    response.attributes &&
    response.attributes.blockchain_info &&
    response.attributes.blockchain_info.alerts &&
    response.attributes.blockchain_info.alerts.length > 0
  )
}

const Actions = {
  ERRORS: 'errors',
  ALERTS: 'alerts',
}

const initialState = {
  errors: [] as string[],
  alerts: [] as string[],
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.ERRORS:
      return {
        ...state,
        errors: action.payload.errors,
      }
    case Actions.ALERTS:
      return {
        ...state,
        alerts: action.payload.alerts,
      }
    default:
      return state
  }
}

const App = () => {
  const appContext = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  axiosIns.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  axiosIns.interceptors.response.use(
    response => {
      dispatch({
        action: Actions.ERRORS,
        payload: {
          errors: [],
        },
      })
      return response
    },
    error => {
      dispatch({
        action: Actions.ERRORS,
        payload: {
          errors: [NetworkError],
        },
      })
      if (error && error.response && error.response.data) {
        const { message } = error.response.data
        switch (error.response.status) {
          case 422:
            dispatch({
              action: Actions.ERRORS,
              payload: {
                errors: [],
              },
            })
            break
          case 503:
            dispatch({
              action: Actions.ERRORS,
              payload: {
                errors: [],
              },
            })
            if (message) {
              appContext.errorMessage = message
            }
            browserHistory.replace('/maintain')
            break
          case 404:
            dispatch({
              action: Actions.ERRORS,
              payload: {
                errors: [],
              },
            })
            break
          default:
            dispatch({
              action: Actions.ERRORS,
              payload: {
                errors: [NetworkError],
              },
            })
            break
        }
      }
      return Promise.reject(error)
    },
  )

  const resizeListener = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      appContext.resize(window.innerWidth, window.innerHeight)
      resizeTimer = null
    }, RESIZE_LATENCY)
  }

  useEffect(() => {
    window.addEventListener('resize', resizeListener)
    return () => {
      if (resizeListener) window.removeEventListener('resize', resizeListener)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const listen = setInterval(() => {
      fetchBlockchainInfo().then((response: BlockchainInfoWrapper) => {
        if (alertNotEmpty(response)) {
          const alertMessages = response.attributes.blockchain_info.alerts.map(alert => {
            return alert.message
          })
          dispatch({
            action: Actions.ALERTS,
            payload: {
              alerts: alertMessages,
            },
          })
        } else {
          dispatch({
            action: Actions.ALERTS,
            payload: {
              alerts: [],
            },
          })
        }
      })
    }, BLOCKCHAIN_ALERT_POLLING_TIME)
    return () => clearInterval(listen)
  }, [])

  return (
    <AppDiv>
      <Routers contexts={state.alerts.concat(state.errors)} />
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
        show={appContext.show}
      />
      <Toast
        style={{
          bottom: 10,
        }}
      />
    </AppDiv>
  )
}

export default withProviders(App)
