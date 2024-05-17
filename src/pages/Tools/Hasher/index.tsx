import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ToolsContainer from '../ToolsContainer'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../../../components/ui/Tabs'
import styles from './styles.module.scss'
import { ScriptToHash } from './ScriptToHash'

enum tabs {
  scriptToHash = 'script-to-hash',
}

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
            </TabsList>
            <TabsContent value={tabs.scriptToHash}>
              <ScriptToHash />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolsContainer>
  )
}

export default AddressConversion
