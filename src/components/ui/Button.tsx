import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import classNames from 'classnames'
import styles from './Button.module.scss'

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={classNames(
        styles.button,
        styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
        className,
      )}
      {...props}
    />
  )
}

export { Button }
