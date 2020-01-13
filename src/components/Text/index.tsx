import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { AppDispatch } from '../../contexts/providers/reducer'
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

export const HighLightLink = ({
  value,
  to,
  dispatch,
  tooltip,
}: {
  value: string
  to: string
  dispatch?: AppDispatch
  tooltip?: string
}) => {
  return tooltip && dispatch ? (
    <Tooltip placement="top" title={<CopyTooltipText content={tooltip} dispatch={dispatch} />}>
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
