import PCDataNotFoundImage from '../../assets/pc_data_not_found.png'
import MobileDataNotFoundImage from '../../assets/mobile_data_not_found.png'
import { useIsMobile } from '../../utils/hook'
import { ErrorPanel } from './styled'

export default () => {
  const isMobile = useIsMobile()
  return (
    <ErrorPanel>
      <img alt="data not found" src={isMobile ? MobileDataNotFoundImage : PCDataNotFoundImage} />
    </ErrorPanel>
  )
}
