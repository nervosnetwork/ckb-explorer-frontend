import { FC, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import styles from './BaseMethods.module.scss'
import { XUDT } from '../../../models/Xudt'
import { SSRIBaseMethods } from './types'

const BaseMethods: FC<{
  xudt: XUDT | undefined
  expandedMethods: string[]
  setExpandedMethods: (methods: string[]) => void
}> = ({ xudt, expandedMethods, setExpandedMethods }) => {
  const handleExpand = useCallback(
    (hash: string) => {
      if (expandedMethods.includes(hash)) {
        setExpandedMethods(expandedMethods.filter(name => name !== hash))
      } else {
        setExpandedMethods([...expandedMethods, hash])
      }
    },
    [expandedMethods, setExpandedMethods],
  )

  if (!xudt) {
    return null
  }
  return (
    <div className={styles.container}>
      {SSRIBaseMethods.map((item, index) => {
        const value = item.getValue(xudt)
        const valueType = item.type
        return (
          <div key={item.method} className={styles.item}>
            <div className={styles.methodName} onClick={() => handleExpand(item.hash)}>
              <div className={styles.label}>
                {index + 1}. {item.method}
                <span className={styles.hash}>({item.hash})</span>
              </div>
              {expandedMethods.includes(item.hash) ? (
                <ChevronUp className={styles.expandIcon} />
              ) : (
                <ChevronDown className={styles.expandIcon} />
              )}
            </div>
            {expandedMethods.includes(item.hash) && (
              <div className={styles.value}>
                {valueType === 'string' && <div>{value}</div>}
                {valueType === 'image' && <img src={value ?? ''} alt="icon" width={100} />}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BaseMethods
