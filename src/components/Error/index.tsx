import PCDataNotFoundImage from '../../assets/pc_data_not_found.png'
import MobileDataNotFoundImage from '../../assets/mobile_data_not_found.png'
import { isMobile } from '../../utils/screen'
import { ErrorPanel } from './styled'

export default () => (
  <ErrorPanel>
    <img alt="data not found" src={isMobile() ? MobileDataNotFoundImage : PCDataNotFoundImage} />
  </ErrorPanel>
)
