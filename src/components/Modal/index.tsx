import { ReactNode } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { ModalPanel } from './styled'

const SimpleModal = ({ children, isShow, setIsShow }: { children: ReactNode; isShow: boolean; setIsShow: Function }) =>
  isShow ? (
    <ModalPanel>
      <OutsideClickHandler
        onOutsideClick={e => {
          const elm = e.target as HTMLElement

          if (elm.closest('[data-role=decoder]')) {
            // ignore click inside decoder dialog
            return
          }

          setIsShow(false)
        }}
      >
        {children}
      </OutsideClickHandler>
    </ModalPanel>
  ) : null

export default SimpleModal
