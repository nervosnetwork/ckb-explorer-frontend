import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyTooltipText from './CopyTooltipText'
import { HighLightPanel } from './styled'

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
