import { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'

const ContentPanel = styled.div`
  width: 100%;
  flex: 1;
  background: #ededed;
`
export default ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  return <ContentPanel style={style}>{children}</ContentPanel>
}
