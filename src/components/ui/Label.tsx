'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import classNames from 'classnames'
import styles from './Label.module.scss'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={classNames(
        styles.label,
        'group-data-[disabled=true]:pointerEventsNone',
        'group-data-[disabled=true]:opacity50',
        'peer-disabled:cursorNotAllowed',
        'peer-disabled:opacity50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
