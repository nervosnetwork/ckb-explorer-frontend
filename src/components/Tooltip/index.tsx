import React from 'react'
import styled from 'styled-components'

const TooltipPanel = styled.div`
  width: 300px;
  height: auto;
  padding: 15px;
  background-color: #676767;
  border-bottom-color: #676767;
  color: #ffffff;
  font-size: 13px;
  line-height: 18px;
  box-sizing: border-box;
  border-radius: 6px;
  position: absolute;
  word-break: break-word;
  z-index: 100;
  top: ${(props: { targetSize: TargetSize }) => props.targetSize.height}px;
  left: ${(props: { targetSize: TargetSize }) => props.targetSize.width / 2 - 150}px;

  @media (max-width: 700px) {
    width: 260px;
    font-size: 12px;
    left: ${(props: { targetSize: TargetSize }) => props.targetSize.width / 2 - 130}px;
  }

  @media (max-width: 320px) {
    width: 180px;
    font-size: 11px;
    left: ${(props: { targetSize: TargetSize }) => props.targetSize.width / 2 - 90}px;
  }

  
  &:: after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: inherit;
    top: -5px;
    left: calc(50% - 5px);
    position: absolute;
    transform: rotate(45deg);
  }
`

export interface TargetSize {
  width: number
  height: number
}

const Tooltip = ({ show = false, message, targetSize }: { show: boolean; message: string; targetSize: TargetSize }) => {
  return <React.Fragment>{show && <TooltipPanel targetSize={targetSize}>{message}</TooltipPanel>}</React.Fragment>
}

export default Tooltip
