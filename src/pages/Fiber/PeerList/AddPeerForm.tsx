import { Cross2Icon } from '@radix-ui/react-icons'
import { type FC, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import styles from './AddPeerForm.module.scss'

interface AddPeerFormProps {
  onSuccess: () => void
}
const AddPeerForm: FC<AddPeerFormProps> = ({ onSuccess }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [t] = useTranslation()
  const setToast = useSetToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dialogRef.current?.close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    dialogRef.current?.close()
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const form = e.currentTarget

    const { peer_id, peer_name, rpc } = form
    const params: Parameters<typeof explorerService.api.addFiberPeer>[0] = {
      rpc: rpc instanceof HTMLInputElement ? rpc.value : '',
      id: peer_id instanceof HTMLInputElement ? peer_id.value : '',
      name: peer_name instanceof HTMLInputElement ? peer_name.value : undefined,
    }

    if (params.rpc && params.id) {
      try {
        await explorerService.api.addFiberPeer(params)
        setToast({ message: 'submitted' })
        onSuccess()
      } catch (e) {
        const message = e instanceof Error ? e.message : JSON.stringify(e)
        setToast({ message })
      }
    }
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close()
    }
  }

  const handleOpen = () => {
    dialogRef.current?.showModal()
  }

  return (
    <>
      <button type="button" onClick={handleOpen}>
        Add Peer
      </button>

      <dialog ref={dialogRef} onClick={handleClickOutside} className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h3>
            <span>Add Fiber Peer</span>
            <button type="button" onClick={handleClose}>
              <Cross2Icon />
            </button>
          </h3>
          <fieldset>
            <label htmlFor="rpc" data-required>
              {t('fiber.peer.rpc_addr')}
            </label>
            <input required id="rpc" placeholder="Peer RPC Address" />
          </fieldset>
          <fieldset>
            <label htmlFor="peer_id" data-required>
              Peer ID
            </label>
            <input required id="peer_id" placeholder="Peer ID" />
          </fieldset>
          <fieldset>
            <label htmlFor="peer_name">{t('fiber.peer.name')}</label>
            <input id="peer_name" placeholder="Peer Alias" />
          </fieldset>
          <button type="submit">Submit</button>
        </form>
      </dialog>
    </>
  )
}

export default AddPeerForm
