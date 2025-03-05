/* eslint-disable react/no-array-index-key */
import styles from './index.module.scss'

const FlatCube = ({ size = 80 }) => {
  const pieces = Array(9).fill(null)

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      {pieces.map((_, index) => (
        <div key={index} className={styles.piece} />
      ))}
    </div>
  )
}

export default FlatCube
