import React from 'react'
import styled from 'styled-components'
import loadingImage from './loading.svg'

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

export default ({ show, onClose }: { show: boolean ; onClose: Function }) => {
  return (
    show? (
      <LoadingDiv className="loading">
        <div
          className="loading__content"
          style={{
            marginTop: 100,
            backgroundColor: 'transparent',
          }}
        >
          <img
            alt="loading"
            style={{
              width: 60,
              height: 60,
            }}
            src={loadingImage}
            onDoubleClick={() => {
              if (onClose) onClose()
            }}
          />
        </div>
      </LoadingDiv>
    ) : <React.Fragment/>
  )
}
