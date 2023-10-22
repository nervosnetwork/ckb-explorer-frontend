import { useTranslation } from 'react-i18next'
import { copyElementValue } from '../../../utils/util'
import SimpleButton from '../../SimpleButton'
import { useSetToast } from '../../Toast'

export default ({ content }: { content: string }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()

  return (
    <SimpleButton
      id={`copy__content__${content}`}
      onClick={(event: any) => {
        event.stopPropagation()
        copyElementValue(document.getElementById(`copy__content__${content}`))
        setToast({ message: t('common.copied') })
        event.preventDefault()
      }}
    >
      {content}
    </SimpleButton>
  )
}
