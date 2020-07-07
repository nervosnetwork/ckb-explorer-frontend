import React from 'react'
import { useAppState } from '../../contexts/providers'
import { AlertPanel } from './styled'
import i18n from '../../utils/i18n'

const Alert = () => {
  const {
    app: { appErrors },
  } = useAppState()
  const [startTime, endTime] = appErrors[2].message

  return startTime && endTime ? (
    <AlertPanel>
      <div>
        <span>{i18n.t('toast.maintenance', { start: startTime, end: endTime })}</span>
      </div>
    </AlertPanel>
  ) : null
}

export default Alert
