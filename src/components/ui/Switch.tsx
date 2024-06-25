import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import classnames from 'classnames'
import styles from './Switch.module.scss'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root className={classnames(styles.switch, className)} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className={classnames(styles.thumb)} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
