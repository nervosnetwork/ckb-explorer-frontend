import { MobileMenusPanel } from './styled'
import MenuItems from '../MenusComp'
import { SearchComp } from '../SearchComp'
import { LanguageMenu } from '../LanguageComp'
import BlockchainComp from '../BlockchainComp'

export default ({ hideMobileMenu }: { hideMobileMenu: () => void }) => (
  <MobileMenusPanel>
    <MenuItems />
    <BlockchainComp />
    <LanguageMenu hideMobileMenu={hideMobileMenu} />
    <SearchComp expanded hideMobileMenu={hideMobileMenu} />
  </MobileMenusPanel>
)
