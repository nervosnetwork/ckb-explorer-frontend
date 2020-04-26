import React, { ReactNode, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { ModalPanel } from './styled'

const SimpleModal = ({ children, isShow }: { children: ReactNode; isShow: boolean }) => {
  const [innerShow, setInnerShow] = useState(true)
  return isShow && innerShow ? (
    <ModalPanel>
      <OutsideClickHandler onOutsideClick={() => setInnerShow(false)}>{children}</OutsideClickHandler>
    </ModalPanel>
  ) : null
}

export default SimpleModal
