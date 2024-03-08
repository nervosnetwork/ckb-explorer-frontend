import styles from './styles.module.scss'
/*
Dom Sammut 2013
***************
Web: www.domsammut.com
Twitter: www.twitter.com/domsammut

View codepen on my website: https://www.domsammut.com/projects/pure-css-loading-animation

*/
const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loading} />
      <div className={styles.text}>loading</div>
    </div>
  )
}
export default Loading
