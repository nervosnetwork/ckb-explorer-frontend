import { useState, useEffect, useReducer, useCallback } from 'react'
import { useTimeoutWithUnmount } from '../../hooks'
import { ToastItemPanel, ToastPanel } from './styled'
import { createGlobalState, useGlobalState } from '../../utils/state'

interface ToastMessage {
  message: string
  type: 'success' | 'warning' | 'danger'
  duration?: number
  id: number
}

const getColor = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return '#3cc68a'
    case 'warning':
      return '#ffae42'
    case 'danger':
      return '#D03A3A'
    default:
      return '#3cc68a'
  }
}

const ANIMATION_DISAPPEAR_TIME = 2000
const MAX_FRAME: number = (ANIMATION_DISAPPEAR_TIME / 1000) * 40 // suppose fps = 40
const DEFAULT_TOAST_DURATION = 3000

const ToastItem = ({ data, willLeave }: { data: ToastMessage; willLeave: Function }) => {
  const [opacity, setOpacity] = useState(1)
  let animationId: number = 0
  useTimeoutWithUnmount(
    () => {
      const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
      let count: number = 0
      const updateOpacity = () => {
        count++
        setOpacity(1 - count / MAX_FRAME)
        if (count < MAX_FRAME) {
          requestAnimationFrame(updateOpacity)
        } else {
          willLeave()
        }
      }
      animationId = requestAnimationFrame(updateOpacity)
    },
    () => {
      if (animationId) {
        const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame
        cancelAnimationFrame(animationId)
      }
    },
    data.duration || DEFAULT_TOAST_DURATION,
  )

  return (
    <ToastItemPanel
      style={{
        opacity,
        background: getColor(data.type),
      }}
    >
      <div className="toastText">{data.message}</div>
    </ToastItemPanel>
  )
}

interface State {
  toasts: ToastMessage[]
  toast: string
}

interface Action {
  type: 'ADD' | 'REMOVE'
  payload: {
    toast: ToastMessage
  }
}

const initialState: State = {
  toasts: [],
  toast: '',
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        toasts: state.toasts.concat(action.payload.toast),
      }
    case 'REMOVE':
      return {
        ...state,
        toasts: state.toasts.filter((toast: ToastMessage) => toast.id !== action.payload.toast.id),
      }
    default:
      return state
  }
}

const globalToast = createGlobalState<ToastMessage | null>(null)

export function useSetToast() {
  const [, setToast] = useGlobalState(globalToast)

  return useCallback(
    (data: Pick<ToastMessage, 'message' | 'duration'> & Partial<Pick<ToastMessage, 'type'>>) =>
      setToast({
        id: new Date().getTime(),
        message: data.message,
        type: data.type ?? 'success',
        duration: data.duration,
      }),
    [setToast],
  )
}

export default () => {
  const [toast] = useGlobalState(globalToast)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (toast) {
      dispatch({
        type: 'ADD',
        payload: {
          toast,
        },
      })
    }
  }, [dispatch, toast])

  return state.toasts.length === 0 ? null : (
    <ToastPanel className="toast">
      {state.toasts &&
        state.toasts.map((item: ToastMessage) => (
          <ToastItem
            willLeave={() => {
              dispatch({
                type: 'REMOVE',
                payload: {
                  toast: item,
                },
              })
            }}
            key={item.id}
            data={item}
          />
        ))}
    </ToastPanel>
  )
}
