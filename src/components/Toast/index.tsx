import React, { useState, useEffect, useContext, useReducer } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../contexts/providers/index'
import { useTimeoutWithUnmount } from '../../utils/hook'

const ToastDiv = styled.div`
  position: absolute;
  position: -webkit-absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  z-index: 9998;
  flex-direction: column;
  pointer-events: none;
`
const ToastItemDiv = styled.div`
  width: 100%;
  background-color: #3cc68a;
  position: fixed;
  position: -webkit-fixed;
  top: 82px;
  opacity: 0.96;
  z-index: 9999;
  height: 70px;
  .toast__text {
    color: white;
    font-size: 20px;
    line-height: 70px;
    text-align: center;
  }

  @media (max-width: 700px) {
    top: 42px;
    height: 36px;

    .toast__text {
      font-size: 14px;
      line-height: 36px;
    }
  }

  @media (max-width: 320px) {
    top: 42px;
    height: 36px;
    .toast__text {
      font-size: 12px;
      line-height: 36px;
    }
  }
`

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
    <ToastItemDiv
      style={{
        opacity,
      }}
    >
      <div className="toast__text">{data.message}</div>
    </ToastItemDiv>
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
        toasts: state.toasts.filter((toast: State.ToastMessage) => {
          return toast.id !== action.payload.toast.id
        }),
      }
    default:
      return state
  }
}

export default () => {
  const { app } = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (app.toast) {
      dispatch({
        type: 'ADD',
        payload: {
          toast: app.toast,
        },
      })
    }
  }, [dispatch, app.toast])

  return state.toasts.length === 0 ? null : (
    <ToastDiv className="toast">
      {state.toasts &&
        state.toasts.map((item: State.ToastMessage) => {
          return (
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
          )
        })}
    </ToastDiv>
  )
}
