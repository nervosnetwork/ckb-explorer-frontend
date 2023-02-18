import { FC } from 'react'
import Search from '../../Search'
import SearchLogo from '../../../assets/search_white.png'
import { HeaderSearchPanel, HeaderSearchBarPanel } from './styled'

export const SearchComp: FC<{
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}> = ({ expanded, setExpanded }) => {
  if (!expanded) {
    return (
      <HeaderSearchBarPanel
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setExpanded(true)
        }}
      >
        <img alt="header search bar" src={SearchLogo} />
      </HeaderSearchBarPanel>
    )
  }

  return (
    <HeaderSearchPanel>
      <Search onEditEnd={() => setExpanded(false)} />
    </HeaderSearchPanel>
  )
}
