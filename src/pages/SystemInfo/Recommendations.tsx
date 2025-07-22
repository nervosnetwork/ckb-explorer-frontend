import { useTranslation } from 'react-i18next'
import { ReactComponent as RecommendationsIcon } from './recommendations.svg'
import { ReactComponent as CpuIcon } from './cpu.svg'
import { ReactComponent as MemoryIcon } from './memory.svg'
import { ReactComponent as StorageIcon } from './storage.svg'
import { ReactComponent as NetworkIcon } from './network.svg'

const Recommendations = () => {
  const { t } = useTranslation()

  const data = [
    {
      title: t('system_info.recommendations.cpu.title'),
      icon: <CpuIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: t('system_info.recommendations.cpu.minimum'), value: '4 cores (2.4GHz+)' },
        { label: t('system_info.recommendations.cpu.recommended'), value: '8 cores (3.0GHz+)' },
        { label: t('system_info.recommendations.cpu.highPerformance'), value: '16 cores (3.5GHz+)' },
      ],
      note: t('system_info.recommendations.cpu.note'),
    },
    {
      title: t('system_info.recommendations.memory.title'),
      icon: <MemoryIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: t('system_info.recommendations.memory.minimum'), value: '16GB' },
        { label: t('system_info.recommendations.memory.recommended'), value: '32GB' },
        { label: t('system_info.recommendations.memory.highPerformance'), value: '64GB' },
      ],
      note: t('system_info.recommendations.memory.note'),
    },
    {
      title: t('system_info.recommendations.storage.title'),
      icon: <StorageIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: t('system_info.recommendations.storage.current_block_size'), value: '~126GB' },
        { label: t('system_info.recommendations.storage.annual_growth'), value: '~5-10GB' },
        { label: t('system_info.recommendations.storage.recommended'), value: '1TB+' },
      ],
      note: t('system_info.recommendations.storage.note'),
    },
    {
      title: t('system_info.recommendations.network.title'),
      icon: <NetworkIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        {
          label: t('system_info.recommendations.network.initial_sync'),
          value: `100 Mbps+ (${t('system_info.recommendations.network.initial_sync_note')})`,
        },
        { label: t('system_info.recommendations.network.daily_operation'), value: '5 Mbps+' },
        { label: t('system_info.recommendations.network.high_load_api'), value: '100 Mbps+' },
      ],
      note: t('system_info.recommendations.network.note'),
    },
  ]
  const colors = ['#F2A208', '#00CC9B', '#1CA2FB']

  return (
    <div className="bg-white rounded-sm shadow-sm p-6">
      <div className="flex items-center mb-6 gap-1">
        <RecommendationsIcon className="h-6 w-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-0!">{t('system_info.recommendations.title')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map(i => (
          <div key={i.title} className="bg-[#F5F5F5] rounded-lg px-4 py-3">
            <div className="flex items-center mb-3">
              {i.icon}
              <h3 className="font-medium text-gray-900 mb-0!">{i.title}</h3>
            </div>
            <div className="space-y-2">
              {i.items.map((config, index) => (
                <div key={config.label} className="flex flex-wrap items-center gap-1 rounded-md">
                  <span className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span>{config.label}:</span>
                  <span>{config.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2! mb-0!">*{i.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations
