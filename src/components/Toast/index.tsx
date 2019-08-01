import React, { useState, useEffect, useContext, useReducer } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../contexts/providers/index'

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
