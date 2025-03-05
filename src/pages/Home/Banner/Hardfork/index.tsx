import { Link } from '../../../../components/Link'
import SquareBackground from '../../../../components/SquareBackground'
import { ESTIMATED_ACTIVATION_TIME } from '../../../../constants/common'
import Cube from './3d_cube.png'
import styles from './index.module.scss'

const HardforkBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <SquareBackground
          speed={0.1}
          squareSize={24}
          direction="down" // up, down, left, right, diagonal
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>
            <Link to="/hardfork">Next Hardfork of CKB</Link>
          </h1>
          <div className={styles.epoch}>
            <span>{ESTIMATED_ACTIVATION_TIME.epoch.toLocaleString('en')}</span>
            <span>Target Epoch Number</span>
          </div>
        </div>
        <div className={styles.illustration}>
          <img src={Cube} alt="3d cube" />
          <div className={styles.annotation}>
            <Link to="/hardfork#syscall">VM Syscalls 3</Link>
            <Link to="/hardfork#ckb-vm-2">CKB-VM V2</Link>
            <Link to="/hardfork#data-structure">Data Structure</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HardforkBanner
