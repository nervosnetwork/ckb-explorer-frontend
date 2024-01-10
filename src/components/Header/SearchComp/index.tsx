import { FC, memo, useCallback } from 'react'
import Search from '../../Search'
import { HeaderSearchPanel } from './styled'

export const SearchComp: FC<{
  setExpanded?: (expanded: boolean) => void
  hideMobileMenu?: () => void
}> = memo(({ hideMobileMenu }) => {
  const onEditEnd = useCallback(() => {
    hideMobileMenu?.()
  }, [hideMobileMenu])

  return (
    <HeaderSearchPanel>
      <Search onEditEnd={onEditEnd} />
    </HeaderSearchPanel>
  )
})
