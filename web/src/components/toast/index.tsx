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
  width: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 2px;
  position: absolute;
  bottom: 30px;
  padding: 10px;
  margin-left: 10%;
  z-index: 9999;
  min-height: 32px;
  .toast--text {
    color: white;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
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
    const requestAnimationFrame = window.webkitRequestAnimationFrame
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
        const cancelAnimationFrame = window.webkitCancelAnimationFrame
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
      <div className="toast--text">{data.text}</div>
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
