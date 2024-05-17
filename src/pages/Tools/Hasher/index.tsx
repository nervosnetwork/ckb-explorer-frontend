import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ToolsContainer from '../ToolsContainer'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../../../components/ui/Tabs'
import styles from './styles.module.scss'
import { ScriptToHash } from './ScriptToHash'
import { Hash160 } from './Hash160'
import { DataToHash } from './DataToHash'

enum tabs {
  scriptToHash = 'script-to-hash',
  dataToHash = 'data-to-hash',
  hash160 = 'hash160',
}

// todo add anchor for default tab
const AddressConversion: FC = () => {
  const { t } = useTranslation()

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.hasher')}</div>
        <div>
          <Tabs defaultValue={tabs.scriptToHash}>
            <TabsList style={{ width: '100%' }}>
              <TabsTrigger value={tabs.scriptToHash}>{t('tools.script_to_hash')}</TabsTrigger>
              <TabsTrigger value={tabs.dataToHash}>{t('tools.data_to_hash')}</TabsTrigger>
              <TabsTrigger value={tabs.hash160}>{t('tools.hash160')}</TabsTrigger>
            </TabsList>
            <TabsContent value={tabs.scriptToHash}>
              <ScriptToHash />
            </TabsContent>
            <TabsContent value={tabs.dataToHash}>
              <DataToHash />
            </TabsContent>
            <TabsContent value={tabs.hash160}>
              <Hash160 />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolsContainer>
  )
}

export default AddressConversion
