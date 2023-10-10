import i18n from '../../../utils/i18n'
import { copyElementValue } from '../../../utils/util'
import SimpleButton from '../../SimpleButton'
import { useSetToast } from '../../Toast'

export default ({ content }: { content: string }) => {
  const setToast = useSetToast()
  return (
    <SimpleButton
      id={`copy__content__${content}`}
      onClick={(event: any) => {
        event.stopPropagation()
        copyElementValue(document.getElementById(`copy__content__${content}`))
        setToast({ message: i18n.t('common.copied') })
        event.preventDefault()
      }}
    >
      {content}
    </SimpleButton>
  )
}
