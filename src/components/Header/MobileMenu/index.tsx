import React from 'react'
import { MobileMenusPanel } from './styled'
import MenuItems from '../MenusComp'
import { SearchComp } from '../SearchComp'
import LanguageComp from '../LanguageComp'
import BlockchainComp from '../BlockchainComp'

export default () => {
  return (
    <MobileMenusPanel>
      <MenuItems />
      <BlockchainComp />
      <LanguageComp />
      <SearchComp />
    </MobileMenusPanel>
  )
}
