import styled from 'styled-components'

export const ToastPanel = styled.div`
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

export const ToastItemPanel = styled.div`
  width: 100%;
  position: fixed;
  position: -webkit-fixed;
  top: var(--navbar-height);
  opacity: 0.96;
  z-index: 9999;
  height: 60px;

  .toast__text {
    color: white;
    font-size: 20px;
    line-height: 60px;
    text-align: center;
  }

  @media (width <= 750px) {
    top: 42px;
    height: 36px;

    .toast__text {
      font-size: 14px;
      line-height: 36px;
    }
  }

  @media (width <= 320px) {
    top: 42px;
    height: 36px;

    .toast__text {
      font-size: 12px;
      line-height: 36px;
    }
  }
`
