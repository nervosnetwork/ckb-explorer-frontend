import { CSSProperties, ReactNode } from 'react'
import { PagePanel } from './styled'

export default ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <PagePanel style={style}>{children}</PagePanel>
)
