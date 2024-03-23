import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { ReactComponent as QrCodeIcon } from './qrcode.svg'
import styles from './styles.module.scss'

// TODO: add address verification
// network type
// joyID
const Qrcode = ({ text }: { text: string }) => {
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const cvs = qrRef.current
    if (!cvs) return
    QRCode.toCanvas(
      cvs,
      text,
      {
        margin: 5,
        errorCorrectionLevel: 'H',
        width: 144,
      },
      err => {
        if (err) {
          console.error(err)
        }
      },
    )
  }, [qrRef, text])

  return (
    <div className={styles.container}>
      <label htmlFor="address-qr">
        <QrCodeIcon />
      </label>
      <input id="address-qr" />
      <canvas ref={qrRef} className={styles.qrcode} />
    </div>
  )
}

export default Qrcode
