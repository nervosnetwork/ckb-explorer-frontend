import { isMainnet } from '../../../utils/chain'
import { ChainTypePanel } from './styled'
import SimpleButton from '../../SimpleButton'
import { ChainName, MAINNET_URL, TESTNET_URL } from '../../../constants/common'

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const hideDropdown = () => {
    setShow(false)
  }

  return (
    <ChainTypePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className={`chainType${isMainnet() ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={MAINNET_URL}>{`${ChainName.Mainnet} mainnet`}</a>
      </SimpleButton>
      <div className="chainTypeSeparate" />
      <SimpleButton className={`chainType${!isMainnet() ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={TESTNET_URL}>{`${ChainName.Testnet} testnet`}</a>
      </SimpleButton>
    </ChainTypePanel>
  )
}
