import { useState } from 'react'
import KBarContent from './Content'

const KBar = () => {
  const [openCount, setOpenCount] = useState(0)

  // Since KBar has no api to reset the search result when it is closed, we need to use a key to reet the whole component
  return <KBarContent key={openCount} setOpenCount={setOpenCount} />
}

export default KBar
