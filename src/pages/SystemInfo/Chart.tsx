import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from '../../components/ui/Select'
import { cn } from '../../lib/utils'

const Chart = () => {
  const { t } = useTranslation()
  const [selectedChart, setselectedChart] = useState<'CPU' | 'Memory'>('CPU')

  return (
    <div className="flex flex-col gap-4 bg-white rounded-sm shadow-sm p-6 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center relative gap-2">
        <span className="text-xl">{t('system_info.chartTitle')}</span>
        <Select value={selectedChart} onValueChange={value => setselectedChart(value as 'CPU' | 'Memory')}>
          <SelectTrigger className="md:absolute right-0 self-end">
            <SelectValue>{t(`system_info.${selectedChart}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPU">{t('system_info.CPU')}</SelectItem>
            <SelectItem value="Memory">{t('system_info.Memory')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          src="https://grafana.magickbase.com/d-solo/PwMJtdvnt/explorer-resource?orgId=1&refresh=10s&panelId=58"
          title="cpu-chart"
          className={cn('w-full h-[500px] min-w-[800px]', selectedChart === 'CPU' ? 'block' : 'hidden')}
        />
        <iframe
          src="https://grafana.magickbase.com/d-solo/PwMJtdvnt/explorer-resource?orgId=1&panelId=80&refresh=10s"
          title="memory-chart"
          className={cn('w-full h-[500px] min-w-[800px]', selectedChart === 'Memory' ? 'block' : 'hidden')}
        />
      </div>
    </div>
  )
}

export default Chart
