import React from 'react'
import styled from 'styled-components'
import loadingImage from './loading.svg'
import { Loading as LoadingType } from '../../contexts/App'

const LoadingDiv = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
  z-index: 1000;

  .loading__content {
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
  .loading__content > div > img {
    -webkit-transform: rotate(360deg);
    -webkit-animation: loadingAnimation 1.6s linear 0ms infinite;
  }
`
export default ({ data, onClose }: { data: LoadingType | null; onClose: Function }) => {
  if (!data) return null
  return (
    <LoadingDiv className="loading">
      <div
        className="loading__content"
        style={{
          marginTop: data.maskTop || 0,
          backgroundColor: data.maskColor || 'transparent',
        }}
      >
        <img
          alt="loading"
          style={{
            width: 36,
            height: 36,
          }}
          src={loadingImage}
          onDoubleClick={() => {
            if (onClose) onClose()
          }}
        />
      </div>
    </LoadingDiv>
  )
}
