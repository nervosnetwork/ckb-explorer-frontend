import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import JsonView from '@microlink/react-json-view'
import { ccc } from '@ckb-ccc/core'
import Loading from '../AwesomeLoadings/Spinner'
import { useCKBNode } from '../../hooks/useCKBNode'
import styles from './styles.module.scss'

const RawTransactionView: FC<{ hash: string }> = ({ hash }) => {
  const { nodeService } = useCKBNode()
  const { data, isLoading } = useQuery(['tx', hash], () => nodeService.rpc.getTransaction(hash))
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    )
  }
  if (!data?.transaction) return <div>{`Transaction ${hash} not loaded`}</div>

  return (
    <JsonView
      src={JSON.parse(ccc.stringify(data.transaction))}
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
            const script = data.transaction?.outputs[index as any][lockType as 'lock' | 'type']
            if (script) {
              window.open(`/script/${script.codeHash}/${script.hashType}`, '_blank')
            }
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
