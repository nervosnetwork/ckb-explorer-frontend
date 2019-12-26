import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const HighLightPanel = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;

  a {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const HighLightLink = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightPanel>
      <Link to={to}>{value}</Link>
    </HighLightPanel>
  )
}
