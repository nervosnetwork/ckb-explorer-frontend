import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyTooltipText from './CopyTooltipText'

export const HighLightPanel = styled.div`
  color: ${props => props.theme.primary};
  font-size: 14px;

  @media (max-width: 700px) {
    font-size: 13px;
  }

  a {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${props => props.theme.primary};
    margin-top: 3px;

    @media (max-width: 700px) {
      margin-top: 1px;
    }
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const HighLightLink = ({ value, to, tooltip }: { value: string; to: string; tooltip?: string }) => {
  return tooltip ? (
    <Tooltip placement="top" title={<CopyTooltipText content={tooltip} />}>
      <HighLightPanel>
        <Link to={to}>{value}</Link>
      </HighLightPanel>
    </Tooltip>
  ) : (
    <HighLightPanel>
      <Link to={to}>{value}</Link>
    </HighLightPanel>
  )
}
