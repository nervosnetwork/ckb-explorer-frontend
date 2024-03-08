import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import JsonView from '@microlink/react-json-view'
import Loading from '../AwesomeLoadings/Spinner'

import { getTx } from '../../services/NodeService'
import styles from './styles.module.scss'

const RawTransactionView: FC<{ hash: string }> = ({ hash }) => {
  const { data, isLoading } = useQuery<{ result: { transaction: any } }>(['tx', hash], () => getTx(hash))
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    )
  }
  if (!data?.result?.transaction) return <div>{`Transaction ${hash} not loaded`}</div>
  return (
    <JsonView
      src={data.result.transaction}
      name="Transaction"
      indentWidth={4}
      collapseStringsAfterLength={100}
      groupArraysAfterLength={20}
      iconStyle="square"
      displayDataTypes={false}
      style={{
        borderRadius: 4,
        marginTop: 10,
        background: '#f5f5f5',
        padding: 8,
        overflow: 'auto',
      }}
      onSelect={select => {
        switch (select.name) {
          case 'tx_hash': {
            window.open(`/transaction/${select.value}`, '_blank')
            break
          }
          case 'code_hash': {
            const [, index, lockType] = select.namespace
            if (!index || !lockType) return
            const script = data.result.transaction.outputs[index][lockType]
            window.open(`/script/${script.code_hash}/${script.hash_type}`, '_blank')
            break
          }
          default: {
            // ignore
          }
        }
      }}
      theme={{
        base00: 'white',
        base01: '#ddd',
        base02: '#ddd',
        base03: '#444',
        base04: 'purple',
        base05: '#444',
        base06: '#444',
        base07: '#444',
        base08: '#444',
        base09: 'var(--primary-color)',
        base0A: 'var(--primary-color)',
        base0B: 'var(--primary-color)',
        base0C: 'var(--primary-color)',
        base0D: 'var(--primary-color)',
        base0E: 'var(--primary-color)',
        base0F: 'var(--primary-color)',
      }}
    />
  )
}
export default RawTransactionView
