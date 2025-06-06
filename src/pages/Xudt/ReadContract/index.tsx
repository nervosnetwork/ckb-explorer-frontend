import { FC, useCallback, useEffect, useState } from 'react'
import { ssri } from '@ckb-ccc/ssri'
import { ccc } from '@ckb-ccc/core'
import { useTranslation } from 'react-i18next'
import MethodCaller from './MethodCaller'
import styles from './index.module.scss'
import { ReadContractContextProvider } from './context'
import CONFIG from '../../../config'
import { XUDT } from '../../../models/Xudt'
import BaseMethods from './BaseMethods'
import { SSRIBaseMethods } from './types'

const SSRIExecutorURL = CONFIG.REACT_APP_SSRI_RPC_URL!
const SSRIExecutor = new ssri.ExecutorJsonRpc(SSRIExecutorURL)
const client = CONFIG.CHAIN_TYPE === 'mainnet' ? new ccc.ClientPublicMainnet() : new ccc.ClientPublicTestnet()
const signer = new ccc.SignerCkbPublicKey(
  client,
  '0x026f3255791f578cc5e38783b6f2d87d4709697b797def6bf7b3b9af4120e2bfd9',
)

const ReadContract: FC<{ xudt: XUDT | undefined }> = ({ xudt }) => {
  const { t } = useTranslation()
  const [methodList, setMethodList] = useState<string[]>([])
  const [expandedMethods, setExpandedMethods] = useState<string[]>([])

  const getMethodList = useCallback(async () => {
    if (!xudt?.ssriContractOutpoint) {
      return
    }
    const targetOutPoint = {
      txHash: xudt.ssriContractOutpoint.txHash,
      index: xudt.ssriContractOutpoint.cellIndex,
    }
    const scriptCell = await signer.client.getCell(targetOutPoint)

    if (!scriptCell) {
      throw new Error('Script cell not found')
    }

    if (!scriptCell.cellOutput.type?.hash()) {
      throw new Error('Script cell type hash not found')
    }
    const contract = new ssri.Trait(scriptCell.outPoint, SSRIExecutor)

    if (!contract) {
      throw new Error('Contract not initialized')
    }

    const methodList = await contract.getMethods()
    setMethodList(methodList.res)
  }, [xudt?.ssriContractOutpoint])

  useEffect(() => {
    getMethodList()
  }, [getMethodList])

  if (!xudt?.ssriContractOutpoint?.txHash || xudt?.ssriContractOutpoint?.cellIndex === undefined) {
    return null
  }

  const customMethodList = methodList.filter(method => SSRIBaseMethods.every(item => item.hash !== method))

  return (
    <div className={styles.container}>
      <div className={styles.expandAllButtonContainer}>
        <div
          onClick={() => setExpandedMethods(expandedMethods.length === methodList.length ? [] : methodList)}
          className={styles.expandAllButton}
        >
          {expandedMethods.length === methodList.length
            ? t('xudt.read_contract.collapse_all')
            : t('xudt.read_contract.expand_all')}
        </div>
      </div>
      <BaseMethods xudt={xudt} expandedMethods={expandedMethods} setExpandedMethods={setExpandedMethods} />
      {customMethodList.map((method, index) => (
        <ReadContractContextProvider
          signer={signer}
          key={method}
          contractOutPointTx={xudt.ssriContractOutpoint!.txHash}
          contractOutPointIndex={xudt.ssriContractOutpoint!.cellIndex}
          method={method}
          SSRIExecutor={SSRIExecutor}
          expandedMethods={expandedMethods}
          setExpandedMethods={setExpandedMethods}
        >
          <MethodCaller methodName={method} index={index + SSRIBaseMethods.length + 1} />
        </ReadContractContextProvider>
      ))}
    </div>
  )
}

export default ReadContract
