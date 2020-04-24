import React from 'react'
import { PagePanel } from './styled'

export default ({ children, style }: { children: any; style?: object }) => {
  return <PagePanel style={style}>{children}</PagePanel>
}
