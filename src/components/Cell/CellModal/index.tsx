import type { PropsWithChildren } from 'react'
import { XIcon } from 'lucide-react'
import { CellInfoProps } from '../CellInfo/types'
import CellInfo from '../CellInfo'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '../../ui/dialog'

const CellModal = ({ cell, children }: PropsWithChildren<CellInfoProps>) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="md:max-w-[960px] p-4 md:p-6">
        <CellInfo
          cell={cell}
          suffix={
            <DialogClose
              data-slot="dialog-close"
              className="cursor-pointer text-[#888] ml-auto"
              aria-label="Close"
              title="Close"
            >
              <XIcon size={18} />
              <span className="sr-only">Close</span>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export default CellModal
