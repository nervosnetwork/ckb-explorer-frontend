import React, { useState, useEffect, useContext, useReducer } from 'react'
import styled from 'styled-components'
import AppContext, { ToastMessage } from '../../contexts/App'

const ToastDiv = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  z-index: 9998;
  flex-direction: column;
  pointer-events: none;
`
const ToastItemDiv = styled.div`
  width: 100%;
  background-color: #3cc68a;
  position: fixed;
  top: 85px;
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
    top: 44px;
    height: 36px;

    .toast__text {
      font-size: 14px;
      line-height: 36px;
    }
  }

  @media (max-width: 320px) {
    top: 44px;
    height: 36px;
    .toast__text {
      font-size: 12px;
      line-height: 36px;
    }
  }
`
const ToastItem = ({
  data,
  disappearDuration,
  willLeave,
}: {
  data: any
  disappearDuration?: number
  willLeave: Function
}) => {
  const [opacity, setOpacity] = useState(1)
  useEffect(() => {
    let animationFun: any = null
    const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    animationFun = setTimeout(() => {
      const maxFrame: number = ((disappearDuration || 2000) / 1000) * 40 // suppose fps = 40
      let count: number = 0
      const update = () => {
        count++
        setOpacity(1 - count / maxFrame)
        if (count < maxFrame) {
          animationFun = requestAnimationFrame(update)
        } else {
          willLeave()
        }
      }
      update()
    }, data.timeout)
    return () => {
      if (animationFun) {
        const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame
        cancelAnimationFrame(animationFun)
      }
    }
    // eslint-disable-next-line
  }, [])
  return (
    <ToastItemDiv
      key={`toast${data.id}`}
      style={{
        opacity,
      }}
    >
      <div className="toast__text">{data.text}</div>
    </ToastItemDiv>
  )
}

const initialState = {
  toasts: [] as ToastMessage[],
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
        toasts: state.toasts.filter((toast: ToastMessage) => {
          return toast.id !== action.payload.toast.id
        }),
      }
    default:
      return state
  }
}

export default () => {
  const appContext = useContext(AppContext)
  const { toast } = appContext
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
    <ToastDiv className="toast">
      {state.toasts &&
        state.toasts.map((item: ToastMessage) => {
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
