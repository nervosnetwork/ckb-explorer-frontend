import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ToolsContainer from '../ToolsContainer'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../../../components/ui/Tabs'
import styles from './styles.module.scss'
import Transaction from './Transaction'

enum tabs {
  transaction = 'transaction',
}

const CamelCase: FC = () => {
  const { t } = useTranslation()

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.snake_case_and_camel_case')}</div>
        <div>
          <Tabs defaultValue={tabs.transaction}>
            <TabsList style={{ width: '100%' }}>
              <TabsTrigger value={tabs.transaction}>{t('tools.transaction')}</TabsTrigger>
            </TabsList>
            <TabsContent value={tabs.transaction}>
              <Transaction />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolsContainer>
  )
}

export default CamelCase
