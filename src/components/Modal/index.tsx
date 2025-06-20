import { ReactNode } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import styles from './index.module.scss'

const SimpleModal = ({ children, isShow, setIsShow }: { children: ReactNode; isShow: boolean; setIsShow: Function }) =>
  isShow ? (
    <div className={styles.modalPanel}>
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
    </div>
  ) : null

export default SimpleModal
