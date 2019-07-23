import React, { ReactNode, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'

interface TooltipPanelProps {
  width: string
  offset?: { x: number; y: number }
  arrowOffset: number
}

const TooltipPanel = styled.div`
  width: ${(props: TooltipPanelProps) => props.width};
  padding: 20px 30px 20px 30px;
  background-color: #676767;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #b3b3b3;
  word-break: break-word;
  color: #ffffff;
  font-size: 13px;
  left: 0px;
  transform: translate(
    ${(props: TooltipPanelProps) => (props.offset ? `${props.offset.x}px` : '0px')},
    ${(props: TooltipPanelProps) => (props.offset ? `${props.offset.y}px` : '10px')}
  );
  position: absolute;
  z-index: 2;

  @media (max-width: 700px) {
    padding: 10px 15px 10px 15px;
  }

  &::after {
    content: '';
    left: ${(props: TooltipPanelProps) => `${props.arrowOffset - 16}px`};
    position: absolute;
    top: -6px;
    border: 16px solid transparent;
    border-bottom: 10px solid #676767;
    border-top: 0;
  }
`

interface TooltipProps {
  show: boolean
  targetElementId: string
  width?: string
  offset?: { x: number; y: number }
  children?: ReactNode
}

export default ({ show, targetElementId, width = '100%', offset, children }: TooltipProps) => {
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
