import styles from './index.module.scss'
import MenuItems, { MoreMenu } from '../MenusComp'
import { SearchComp } from '../SearchComp'
import BlockchainComp from '../BlockchainComp'

export default ({ hideMobileMenu }: { hideMobileMenu: () => void }) => (
  <div className={styles.mobileMenusPanel}>
    <MenuItems isMobile />
    <BlockchainComp />
    <MoreMenu isMobile />
    <SearchComp hideMobileMenu={hideMobileMenu} />
  </div>
)
