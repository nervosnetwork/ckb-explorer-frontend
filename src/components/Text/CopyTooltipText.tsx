import React from 'react'
import i18n from '../../utils/i18n'
import { copyElementValue } from '../../utils/util'
import { AppActions } from '../../contexts/providers/reducer'
import { useDispatch } from '../../contexts/providers'
import SimpleButton from '../SimpleButton'

export default ({ content }: { content: string }) => {
  const dispatch = useDispatch()
  return (
    <SimpleButton
      id={`copy_content${content}`}
      onClick={(event: any) => {
        event.stopPropagation()
        copyElementValue(document.getElementById(`copy_content${content}`))
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
