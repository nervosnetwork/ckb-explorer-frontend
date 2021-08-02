import { PagePanel } from './styled'

export default ({ children, style }: { children: any; style?: object }) => (
  <PagePanel style={style}>{children}</PagePanel>
)
