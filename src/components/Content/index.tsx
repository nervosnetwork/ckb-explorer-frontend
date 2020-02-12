import React from 'react'
import styled from 'styled-components'
import { useAppState } from '../../contexts/providers'
import MobileMenu from '../Header/MobileMenu'

const ContentDiv = styled.div`
  width: 100%;
  overflow-x: hidden;
  flex: 1;
  margin-top: 64px;
`
export default ({ children, style }: { children: any; style?: any }) => {
  const { components } = useAppState()
  const { mobileMenuVisible } = components
  return <ContentDiv style={style}>{mobileMenuVisible ? <MobileMenu /> : children}</ContentDiv>
}
