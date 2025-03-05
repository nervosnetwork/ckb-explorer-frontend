import { CopyIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import type { Fiber } from '../../../services/ExplorerService'
import styles from './fiber.module.scss'

const FiberPeerInfo = ({ peer }: { peer: Fiber.Channel.Peer }) => {
  return (
    <div className={styles.container}>
      <Link to={`/fiber/peers/${peer.peerId}`} className={styles.name}>
        {peer.name || 'Untitled Node'}
      </Link>
      <div className={styles.id}>
        <Tooltip title={peer.peerId}>
          <Link to={`/fiber/peers/${peer.peerId}`}>{`${peer.peerId.slice(0, 8)}...${peer.peerId.slice(-8)}`}</Link>
        </Tooltip>
        <button data-copy-text={peer.peerId} type="button">
          <CopyIcon />
        </button>
      </div>
    </div>
  )
}

export default FiberPeerInfo
