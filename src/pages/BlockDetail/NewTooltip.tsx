import React, { ReactNode, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'

interface TooltipPanelProps {
  width: string
  offset: number
  arrowOffset: number
}

const TooltipPanel = styled.div`
  width: ${(props: TooltipPanelProps) => props.width};
  padding: 15px;
  background-color: #676767;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #b3b3b3;
  word-break: break-word;
  color: #ffffff;
  left: 0px;
  transform: translate(${(props: TooltipPanelProps) => `${props.offset}px`}, 10px);

  position: absolute;
  z-index: 2;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: inherit;
    top: -5px;
    left: ${(props: TooltipPanelProps) => `${props.arrowOffset}px`};
    position: absolute;
    transform: rotate(45deg);
  }
`

interface TooltipProps {
  show: boolean
  targetElementId: string
  width?: string
  offset?: number
  children?: ReactNode
}

export default ({ show, targetElementId, width = '100%', offset = 0, children }: TooltipProps) => {
  const [arrowOffset, setArrowOffset] = useState(0)
  useLayoutEffect(() => {
    const currentElement = document.getElementById('TooltipPanel')
    if (currentElement) {
      const targetElement = document.getElementById(targetElementId)
      if (targetElement) {
        const currentReact = currentElement.getBoundingClientRect()
        const targetReact = targetElement.getBoundingClientRect()
        setArrowOffset(targetReact.left - currentReact.left + targetReact.width / 2)
      }
    }
  }, [show, targetElementId])
  return (
    <React.Fragment>
      {show && (
        <TooltipPanel id="TooltipPanel" width={width} offset={offset} arrowOffset={arrowOffset}>
          {children}
        </TooltipPanel>
      )}
    </React.Fragment>
  )
}
