import { FC, PropsWithChildren, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCKBNode } from '../../../hooks/useCKBNode'
import CommonModal from '../../CommonModal'
import { HelpTip } from '../../HelpTip'
import { Switch } from '../../ui/Switch'
import CloseIcon from '../../../assets/modal_close.png'
import { ReactComponent as EditIcon } from './edit.svg'
import { ReactComponent as DeleteIcon } from './delete.svg'
import { useSetToast } from '../../Toast'
import BackIcon from './back.png'
import styles from './style.module.scss'
import Tooltip from '../../Tooltip'

function isValidHttpUrl(str: string) {
  let url

  try {
    url = new URL(str)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

const NodeEditForm: FC<
  PropsWithChildren<{
    initialData?: { alias: string; url: string }
    onSubmit: (data: { alias: string; url: string }) => void
  }>
> = ({ children, initialData, onSubmit }) => {
  const { t } = useTranslation()
  const setToast = useSetToast()

  return (
    <form
      className={styles.nodeEditForm}
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        const alias = e.currentTarget.alias.value
        const url = e.currentTarget.url.value

        if (typeof alias !== 'string') {
          setToast({ message: t('node.alias_required'), type: 'danger' })
          return
        }

        if (typeof url !== 'string') {
          setToast({ message: t('node.url_required'), type: 'danger' })
          return
        }

        if (!isValidHttpUrl(url)) {
          setToast({ message: t('node.url_invalid'), type: 'danger' })
          return
        }

        onSubmit({ alias, url })
      }}
    >
      <div>
        <label htmlFor="alias">{t('node.alias')}</label>
        <input name="alias" type="text" defaultValue={initialData?.alias} />
      </div>

      <div>
        <label htmlFor="url">{t('node.rpc_url')}</label>
        <input name="url" type="text" defaultValue={initialData?.url} />
      </div>

      {children}
    </form>
  )
}

export const CKBNodeModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { isActivated, setIsActivated, nodeService, nodes, addNode, removeNode, switchNode, editNode } = useCKBNode()
  const [panel, setPanel] = useState<'main' | 'add' | 'edit'>('main')
  const [editKey, setEditKey] = useState<string | undefined>(undefined)
  const setToast = useSetToast()

  const NodeEditPanel = () => {
    const initialValue = nodes.get(editKey ?? '')
    const initialData = initialValue
      ? {
          alias: initialValue,
          url: editKey!,
        }
      : undefined

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.modalTitle}>
          <button type="button" onClick={() => setPanel('main')} className={styles.closeBtn}>
            <img src={BackIcon} alt="back icon" />
          </button>

          <p>{t('node.modify_node')}</p>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <img src={CloseIcon} alt="close icon" />
          </button>
        </div>

        <NodeEditForm
          initialData={initialData}
          onSubmit={data => {
            if (!editKey) {
              addNode(data)
              setPanel('main')
              return
            }

            const success = editNode(editKey, data)
            if (!success) {
              setToast({ message: t('node.node_existed'), type: 'danger' })
              return
            }

            setPanel('main')
          }}
        >
          <button type="submit" className={styles.btn}>
            {t('node.modify_node')}
          </button>
        </NodeEditForm>
      </div>
    )
  }

  const NodeMainPanel = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.modalTitle}>
        <p>{t('navbar.node')}</p>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <img src={CloseIcon} alt="close icon" />
        </button>
      </div>

      <div className={styles.switcher}>
        <label htmlFor="node-connect-mode">{t('node.node_connect_mode')}</label>
        <HelpTip>{t('node.node_connect_tooltip')}</HelpTip>
        <Switch
          id="node-connect-mode"
          style={{ marginLeft: 'auto' }}
          checked={isActivated}
          onCheckedChange={checked => setIsActivated(checked)}
        />
      </div>

      <div className={styles.nodeList}>
        {[...nodes.entries()].map(([url, alias], index) => (
          <div className={styles.node} key={url}>
            <div className={styles.nodeTitle}>
              <input
                onClick={() =>
                  switchNode(url).catch((err: Error) => setToast({ message: err.message, type: 'danger' }))
                }
                type="checkbox"
                checked={nodeService.nodeEndpoint === url}
              />
              <div className={styles.nodeAlias}>
                <Tooltip trigger={<span>{alias}</span>} placement="top">
                  {alias}
                </Tooltip>
              </div>
              {index !== 0 && (
                <>
                  <button
                    className={styles.nodeAction}
                    type="button"
                    onClick={() => {
                      setPanel('edit')
                      setEditKey(url)
                    }}
                    style={{ marginLeft: 'auto' }}
                  >
                    <EditIcon width={16} />
                  </button>
                  <button className={styles.nodeAction} type="button" onClick={() => removeNode(url)}>
                    <DeleteIcon width={16} />
                  </button>
                </>
              )}
            </div>
            <div className={styles.nodeSubtitle}>({url})</div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.btn} style={{ width: '100%' }} onClick={() => setPanel('add')}>
        {t('node.add_node')}
      </button>
    </div>
  )

  const NodeAddPanel = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.modalTitle}>
        <button type="button" onClick={() => setPanel('main')} className={styles.closeBtn}>
          <img src={BackIcon} alt="back icon" />
        </button>

        <p>{t('node.add_node')}</p>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <img src={CloseIcon} alt="close icon" />
        </button>
      </div>

      <NodeEditForm
        onSubmit={data => {
          const success = addNode({ alias: data.alias, url: data.url })
          if (!success) {
            setToast({ message: t('node.node_existed'), type: 'danger' })
            return
          }

          setPanel('main')
        }}
      >
        <button type="submit" className={styles.btn}>
          {t('node.add_node')}
        </button>
      </NodeEditForm>
    </div>
  )

  return (
    <CommonModal isOpen onClose={onClose}>
      <div ref={ref} className={styles.modalWrapper}>
        {panel === 'main' && <NodeMainPanel />}
        {panel === 'add' && <NodeAddPanel />}
        {panel === 'edit' && <NodeEditPanel />}
      </div>
    </CommonModal>
  )
}
