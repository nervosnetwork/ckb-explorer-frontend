import { useTranslation } from 'react-i18next'
import SimpleButton from '../../SimpleButton'
import { useSetToast } from '../../Toast'

export default ({ content }: { content: string }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()

  return (
    <SimpleButton
      id={`copy__content__${content}`}
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
        navigator.clipboard.writeText(content).then(() => {
          setToast({ message: t('common.copied') })
        })
      }}
    >
      {content}
    </SimpleButton>
  )
}
