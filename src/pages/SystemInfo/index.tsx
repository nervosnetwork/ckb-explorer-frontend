import { useTranslation } from 'react-i18next'
import Recommendations from './Recommendations'
import Chart from './Chart'

const SystemInfoPage = () => {
  const { t } = useTranslation()
  return (
    <div className="container px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold mb-0!">{t('system_info.title')}</h1>
        <p className="text-sm mb-0!">{t('system_info.subTitle')}</p>
      </div>
      <Chart />
      <Recommendations />
    </div>
  )
}

export default SystemInfoPage
