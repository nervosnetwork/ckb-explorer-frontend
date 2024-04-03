import { FC, memo, useCallback } from 'react'
import Search from '../../Search'
import { HeaderSearchPanel } from './styled'

export const SearchComp: FC<{
  setExpanded?: (expanded: boolean) => void
  hideMobileMenu?: () => void
}> = memo(({ hideMobileMenu }) => {
  const onEditEnd = useCallback(() => {
    if (hideMobileMenu) {
      setTimeout(() => hideMobileMenu(), 100)
    }
  }, [hideMobileMenu])

  return (
    <HeaderSearchPanel>
      <Search onEditEnd={onEditEnd} />
    </HeaderSearchPanel>
  )
})
