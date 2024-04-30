import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ToolsContainer from '../ToolsContainer'
import { AddressToScript } from './AddressToScript'
import { ScriptToAddress } from './ScriptToAddress'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../../../components/ui/Tabs'
import styles from './styles.module.scss'

const AddressConversion: FC = () => {
  const { t } = useTranslation()

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.address_conversion')}</div>
        <div style={{ marginBottom: 16 }}>
          {t('tools.address_conversion_description')}
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md"
            target="_blank"
            rel="noreferrer"
          >
            {t('tools.address_rfc')}
          </a>
        </div>

        <div>
          <Tabs defaultValue="address2script">
            <TabsList style={{ width: '100%' }}>
              <TabsTrigger value="address2script">{t('tools.address_to_script')}</TabsTrigger>
              <TabsTrigger value="script2address">{t('tools.script_to_address')}</TabsTrigger>
            </TabsList>
            <TabsContent value="address2script">
              <AddressToScript />
            </TabsContent>
            <TabsContent value="script2address">
              <ScriptToAddress />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolsContainer>
  )
}

export default AddressConversion
