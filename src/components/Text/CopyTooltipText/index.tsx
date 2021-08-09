import i18n from '../../../utils/i18n'
import { copyElementValue } from '../../../utils/util'
import { AppActions } from '../../../contexts/actions'
import { useDispatch } from '../../../contexts/providers'
import SimpleButton from '../../SimpleButton'

export default ({ content }: { content: string }) => {
  const dispatch = useDispatch()
  return (
    <SimpleButton
      id={`copy__content__${content}`}
      onClick={(event: any) => {
        event.stopPropagation()
        copyElementValue(document.getElementById(`copy__content__${content}`))
        dispatch({
          type: AppActions.ShowToastMessage,
          payload: {
            message: i18n.t('common.copied'),
          },
        })
        event.preventDefault()
      }}
    >
      {content}
    </SimpleButton>
  )
}
