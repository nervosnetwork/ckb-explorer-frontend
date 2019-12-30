import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { AppDispatch } from '../../contexts/providers/reducer'
import CopyTooltipText from '../Tooltip/CopyTooltipText'

export const HighLightPanel = styled.div`
  color: ${props => props.theme.primary};
  font-size: 14px;
  height: 18px;
  line-height: 18px;

  @media (max-width: 700px) {
    font-size: 13px;
  }

  a {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${props => props.theme.primary};
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
