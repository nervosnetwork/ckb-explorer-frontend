import React, { useContext } from 'react'
import CopyIcon from '../../../assets/copy.png'
import AppContext from '../../../contexts/App'
import i18n from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { startEndEllipsis } from '../../../utils/string'
import { copyElementValue } from '../../../utils/util'
import AddressHashCardPanel from './styled'

export default ({ title, hash }: { title: string; hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <AddressHashCardPanel>
      <div className="address_hash__title">{title}</div>
      <div id="address_hash__hash">{isMobile() ? startEndEllipsis(hash, 10) : hash}</div>
      <div
        className="address_hash__copy_iocn"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          copyElementValue(document.getElementById('address_hash__hash'))
          appContext.toastMessage(i18n.t('common.copied'), 3000)
        }}
      >
        <img src={CopyIcon} alt="copy" />
      </div>
    </AddressHashCardPanel>
  )
}
