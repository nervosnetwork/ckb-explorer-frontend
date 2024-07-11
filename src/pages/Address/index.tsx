import { useCKBNode } from '../../hooks/useCKBNode'
import AddressPage from './AddressPage'
import NodeAddressPage from './NodeAddressPage'

const Page = () => {
  const { isActivated: nodeModeActivated } = useCKBNode()

  if (nodeModeActivated) {
    return <NodeAddressPage />
  }

  return <AddressPage />
}

export default Page
