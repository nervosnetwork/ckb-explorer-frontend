import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import classNames from 'classnames'
import styles from './Tabs.module.scss'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={classNames(styles.tabs, className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={classNames(styles.tabsList, className)} {...props} />
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger data-slot="tabs-trigger" className={classNames(styles.tabsTrigger, className)} {...props} />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content data-slot="tabs-content" className={classNames(styles.tabsContent, className)} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
