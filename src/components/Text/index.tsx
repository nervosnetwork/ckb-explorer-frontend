import { Link } from '../Link'
import Tooltip from '../Tooltip'
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
    <Tooltip
      trigger={
        <HighLightPanel>
          <Link className={`${className} monospace`} to={to}>
            {value}
          </Link>
        </HighLightPanel>
      }
      placement="top"
    >
      <CopyTooltipText content={tooltip} />
    </Tooltip>
  ) : (
    <HighLightPanel>
      <Link className={`${className} monospace`} to={to}>
        {value}
      </Link>
    </HighLightPanel>
  )
