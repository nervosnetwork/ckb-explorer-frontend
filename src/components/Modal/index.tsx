import { ReactNode } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { ModalPanel } from './styled'

const SimpleModal = ({ children, isShow, setIsShow }: { children: ReactNode; isShow: boolean; setIsShow: Function }) =>
  isShow ? (
    <ModalPanel>
      <OutsideClickHandler onOutsideClick={() => setIsShow(false)}>{children}</OutsideClickHandler>
    </ModalPanel>
  ) : null

export default SimpleModal
