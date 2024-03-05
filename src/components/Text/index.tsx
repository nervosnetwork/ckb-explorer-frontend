import { Tooltip } from 'antd'
import { Link } from '../Link'
import CopyTooltipText from './CopyTooltipText'
import { HighLightPanel } from './styled'

export const HighLightLink = ({
  value,
  to,
  tooltip,
  className,
}: {
  value: string
  to: string
  tooltip?: string
  className?: string
}) =>
  tooltip ? (
    <Tooltip placement="top" title={<CopyTooltipText content={tooltip} />}>
      <HighLightPanel>
        <Link className={`${className} monospace`} to={to}>
          {value}
        </Link>
      </HighLightPanel>
    </Tooltip>
  ) : (
    <HighLightPanel>
      <Link className={`${className} monospace`} to={to}>
        {value}
      </Link>
    </HighLightPanel>
  )
