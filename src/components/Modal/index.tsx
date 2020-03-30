import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler'

export const ModalPanel = styled.div`
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`

const SimpleModal = ({ children, isShow }: { children: ReactNode; isShow: boolean }) => {
  const [innerShow, setInnerShow] = useState(true)
  return isShow && innerShow ? (
    <ModalPanel>
      <OutsideClickHandler onOutsideClick={() => setInnerShow(false)}>{children}</OutsideClickHandler>
    </ModalPanel>
  ) : null
}

export default SimpleModal
