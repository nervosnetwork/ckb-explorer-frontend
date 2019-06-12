import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ToastDiv = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: none;
`
const ToastItemDiv = styled.div`
  width: 100%;
  background-color: #3cc68a;
  border-radius: 6px;
  position: absolute;
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
      color: white;
      font-size: 15px;
      line-height: 36px;
      text-align: center;
    }
  }
`
const ToastItem = ({
  data,
  style,
  disappearDuration,
  willLeave,
}: {
  data: any
  style: object
  disappearDuration?: number
  willLeave: Function
}) => {
  let animationFun: any = null
  const [opacity, setOpacity] = useState(1)
  useEffect(() => {
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
  }, [])
  return (
    <ToastItemDiv
      key={`toast${data.id}`}
      style={{
        ...style,
        opacity,
      }}
    >
      <div className="toast__text">{data.text}</div>
    </ToastItemDiv>
  )
}
export default ({ toastMessage, style }: { toastMessage: any; style: object }) => {
  const [items, setItems] = useState([])
  useEffect(() => {
    if (toastMessage) {
      setItems(items.concat(toastMessage))
    }
  }, [toastMessage])

  return items.length === 0 ? null : (
    <ToastDiv className="toast">
      {items.map((item: any) => {
        return (
          <ToastItem
            willLeave={() => {
              const newItems: any = items.concat([])
              for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === item.id) {
                  newItems.splice(i, 1)
                  break
                }
              }
              setItems(newItems)
            }}
            key={item.id}
            data={item}
            style={style}
          />
        )
      })}
    </ToastDiv>
  )
}
