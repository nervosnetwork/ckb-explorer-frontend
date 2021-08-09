import LoadingImage from '../../../assets/loading.gif'
import LoadingWhiteImage from '../../../assets/loading_white.gif'
import LoadingBlueImage from '../../../assets/blue_loading.gif'
import { isMainnet } from '../../../utils/chain'
import { SmallLoadingPanel } from './styled'

export default ({ isWhite }: { isWhite?: boolean }) => (
  <SmallLoadingPanel>
    {isWhite ? (
      <img className="loading__white" src={LoadingWhiteImage} alt="loading" />
    ) : (
      <img src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    )}
  </SmallLoadingPanel>
)
