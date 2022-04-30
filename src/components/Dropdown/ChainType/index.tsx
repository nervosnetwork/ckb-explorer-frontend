import CONFIG from '../../../config'
import { isMainnet } from '../../../utils/chain'
import { ChainTypePanel } from './styled'
import SimpleButton from '../../SimpleButton'
import { getChainNames } from '../../../utils/util'

export default ({
  setShow,
  left,
  top,
  chainNames,
}: {
  setShow: Function
  left: number
  top: number
  chainNames: ReturnType<typeof getChainNames>
}) => {
  const hideDropdown = () => {
    setShow(false)
  }
  const testnetUrl = `${CONFIG.MAINNET_URL}/${chainNames.testnet}`

  return (
    <ChainTypePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className={`chain__type__${isMainnet() ? 'selected' : 'normal'}`} onClick={hideDropdown}>
        <a href={CONFIG.MAINNET_URL}>{`${chainNames.mainnet} mainnet`}</a>
      </SimpleButton>
      <div className="chain__type__separate" />
      <SimpleButton className={`chain__type__${!isMainnet() ? 'selected' : 'normal'}`} onClick={hideDropdown}>
        <a href={testnetUrl}>{`${chainNames.testnet} testnet`}</a>
      </SimpleButton>
    </ChainTypePanel>
  )
}
