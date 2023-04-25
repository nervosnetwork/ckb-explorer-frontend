import { MobileMenusPanel } from './styled'
import MenuItems from '../MenusComp'
import { SearchComp } from '../SearchComp'
import LanguageComp from '../LanguageComp'
import BlockchainComp from '../BlockchainComp'

export default () => (
  <MobileMenusPanel>
    <MenuItems />
    <BlockchainComp />
    <LanguageComp />
    <SearchComp expanded setExpanded={() => {}} />
  </MobileMenusPanel>
)
