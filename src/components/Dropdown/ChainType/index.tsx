import { ChainTypePanel } from './styled'
import SimpleButton from '../../SimpleButton'
import { IS_MAINNET, MAINNET_URL, TESTNET_URL } from '../../../constants/common'

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const hideDropdown = () => {
    setShow(false)
  }

  return (
    <ChainTypePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className={`chainType${IS_MAINNET ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={MAINNET_URL}>mainnet</a>
      </SimpleButton>
      <div className="chainTypeSeparate" />
      <SimpleButton className={`chainType${!IS_MAINNET ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={TESTNET_URL}>testnet</a>
      </SimpleButton>
    </ChainTypePanel>
  )
}
