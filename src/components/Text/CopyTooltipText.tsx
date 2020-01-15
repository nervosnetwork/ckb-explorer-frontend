import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'
import { copyElementValue } from '../../utils/util'
import { AppActions } from '../../contexts/providers/reducer'
import { useDispatch } from '../../contexts/providers'

const CopyPanel = styled.div`
  cursor: pointer;
`

export default ({ content }: { content: string }) => {
  const dispatch = useDispatch()
  return (
    <CopyPanel
      id="copy_content"
      role="button"
      tabIndex={-1}
      onKeyDown={() => {}}
      onClick={event => {
        event.stopPropagation()
        copyElementValue(document.getElementById('copy_content'))
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
    </CopyPanel>
  )
}
