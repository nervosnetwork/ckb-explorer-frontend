import React from 'react'
import i18n from '../../../utils/i18n'
import CONFIG from '../../../config'
import { isMainnet } from '../../../utils/chain'
import { ChainTypePanel } from './styled'
import SimpleButton from '../../SimpleButton'

const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const hideDropdown = () => {
    setShow(false)
  }

  return (
    <ChainTypePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className={`chain__type__${isMainnet() ? 'selected' : 'normal'}`} onClick={hideDropdown}>
        <a href={CONFIG.MAINNET_URL}>{i18n.t('blockchain.mainnet')}</a>
      </SimpleButton>
      <div className="chain__type__separate" />
      <SimpleButton className={`chain__type__${!isMainnet() ? 'selected' : 'normal'}`} onClick={hideDropdown}>
        <a href={testnetUrl}>{`${CONFIG.TESTNET_NAME} ${i18n.t('blockchain.testnet')}`}</a>
      </SimpleButton>
    </ChainTypePanel>
  )
}
