import React from 'react'
import styled from 'styled-components'
import { Modal as ModalType } from '../../contexts/App'

const ModalDiv = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  z-index: 999;
  pointer-events: all;

  .modal--content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .modal--content > div {
    width: 80%;
    min-height: 100px;
    background-color: white;
    border-radius: 10px 10px;
    padding: 10px;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .modal--close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .modal--close: hover {
    color: red;
    cursor: pointer;
  }
  div[role]: focus {
    outline: none;
  }
`
export default ({ data, onClose }: { data: ModalType | null; onClose: Function }) => {
  if (!data || !data.ui) return null
  return (
    <ModalDiv
      className="modal"
      onClick={() => {
        if (onClose) onClose()
      }}
    >
      <div
        className="modal--content"
        style={{
          marginTop: data.maskTop || 0,
          backgroundColor: data.maskColor || 'rgba(0,0,0,0.7)',
        }}
      >
        <div
          role="menu"
          tabIndex={-1}
          onClick={(e: any) => {
            e.stopPropagation()
          }}
          onKeyPress={(e: any) => {
            e.stopPropagation()
          }}
        >
          {data.ui}
          <div
            role="menu"
            tabIndex={0}
            className="modal--close"
            onClick={() => {
              if (onClose) onClose()
            }}
            onKeyPress={() => {
              if (onClose) onClose()
            }}
          >
            x
          </div>
        </div>
      </div>
    </ModalDiv>
  )
}
