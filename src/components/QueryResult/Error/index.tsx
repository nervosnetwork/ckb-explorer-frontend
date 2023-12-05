import PCDataNotFoundImage from './pc_data_not_found.png'
import MobileDataNotFoundImage from './mobile_data_not_found.png'
import { useIsMobile } from '../../../hooks'
import { ErrorPanel } from './styled'

export default () => {
  const isMobile = useIsMobile()
  return (
    <ErrorPanel>
      <img alt="data not found" src={isMobile ? MobileDataNotFoundImage : PCDataNotFoundImage} />
    </ErrorPanel>
  )
}
