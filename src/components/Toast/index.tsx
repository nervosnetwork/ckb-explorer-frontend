import { useState, useEffect, useReducer, useCallback } from 'react'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { ToastItemPanel, ToastPanel } from './styled'
import { createGlobalState, useGlobalState } from '../../utils/state'

const getColor = (type: 'success' | 'warning' | 'danger') => {
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

const ToastItem = ({ data, willLeave }: { data: State.ToastMessage; willLeave: Function }) => {
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
      <div className="toast__text">{data.message}</div>
    </ToastItemPanel>
  )
}

const initialState = {
  toasts: [] as State.ToastMessage[],
  toast: '',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        toasts: state.toasts.concat(action.payload.toast),
      }
    case 'REMOVE':
      return {
        ...state,
        toasts: state.toasts.filter((toast: State.ToastMessage) => toast.id !== action.payload.toast.id),
      }
    default:
      return state
  }
}

const globalToast = createGlobalState<State.ToastMessage | null>(null)

export function useSetToast() {
  const [, setToast] = useGlobalState(globalToast)

  return useCallback(
    (data: Pick<State.ToastMessage, 'message' | 'duration'> & Partial<Pick<State.ToastMessage, 'type'>>) =>
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
        state.toasts.map((item: State.ToastMessage) => (
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
