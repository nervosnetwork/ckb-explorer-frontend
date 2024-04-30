import { MobileMenusPanel } from './styled'
import MenuItems, { MoreMenu } from '../MenusComp'
import { SearchComp } from '../SearchComp'
import BlockchainComp from '../BlockchainComp'

export default ({ hideMobileMenu }: { hideMobileMenu: () => void }) => (
  <MobileMenusPanel>
    <MenuItems isMobile />
    <BlockchainComp isMobile />
    <MoreMenu isMobile />
    <SearchComp hideMobileMenu={hideMobileMenu} />
  </MobileMenusPanel>
)
