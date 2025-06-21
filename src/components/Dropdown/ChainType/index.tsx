import SimpleButton from '../../SimpleButton'
import { ChainName, IS_MAINNET, MAINNET_URL, TESTNET_URL } from '../../../constants/common'
import styles from './index.module.scss'

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const hideDropdown = () => {
    setShow(false)
  }

  return (
    <div style={{ left, top }} className={styles.chainTypePanel} onMouseLeave={hideDropdown}>
      <SimpleButton className={`chainType${IS_MAINNET ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={MAINNET_URL}>{`${ChainName.Mainnet} Mainnet`}</a>
      </SimpleButton>
      <div className="chainTypeSeparate" />
      <SimpleButton className={`chainType${!IS_MAINNET ? 'Selected' : 'Normal'}`} onClick={hideDropdown}>
        <a href={TESTNET_URL}>{`${ChainName.Testnet} Testnet`}</a>
      </SimpleButton>
    </div>
  )
}
