import { useState } from 'react'
import { Trans } from 'react-i18next'
import { CKBNodeModal } from './CKBNodeModal'

import styles from './style.module.scss'

const NodeAlert = () => {
  const [nodeModalVisible, setNodeModalVisible] = useState(false)
  return (
    <>
      <div className={styles.alert}>
        <Trans
          i18nKey="node.alert"
          components={{
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            switcher: <span className={styles.clickable} onClick={() => setNodeModalVisible(true)} />,
          }}
        />
      </div>
      {nodeModalVisible ? <CKBNodeModal onClose={() => setNodeModalVisible(false)} /> : null}
    </>
  )
}

export default NodeAlert
