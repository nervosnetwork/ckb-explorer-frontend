import { ReactNode } from 'react'
import styled from 'styled-components'
import { useAppState } from '../../contexts/providers'
import MobileMenu from '../Header/MobileMenu'

const ContentPanel = styled.div`
  width: 100%;
  overflow-x: hidden;
  flex: 1;
  background: #ededed;
`
export default ({ children, style }: { children: ReactNode; style?: any }) => {
  const {
    components: { mobileMenuVisible },
  } = useAppState()
  return <ContentPanel style={style}>{mobileMenuVisible ? <MobileMenu /> : children}</ContentPanel>
}
