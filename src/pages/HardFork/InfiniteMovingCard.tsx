import React, { useEffect, useState } from 'react'
import styles from './InfiniteMovingCard.module.scss'

export const InfiniteMovingCard = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string
    avatars: string
    content: string
    date: string
    link: string
  }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    addAnimation()
  }, [])

  const [start, setStart] = useState(false)

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach(item => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards')
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse')
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      }
    }
  }

  return (
    <div ref={containerRef} className={`${styles.scroller} ${className || ''}`}>
      <div
        ref={scrollerRef}
        className={`${styles.scrollerList} ${start ? styles.animate : ''} ${pauseOnHover ? styles.pauseOnHover : ''}`}
      >
        {items.map(item => (
          <a href={item.link} target="__blank" key={item.content}>
            <div className={styles.card}>
              <blockquote>
                <div aria-hidden="true" className={styles.cardBackground} />
                <div className={styles.user}>
                  <div className={styles.avatar} style={{ backgroundImage: `url(${item.avatars})` }} />
                  <div className={styles.username}>{item.name}</div>
                </div>
                <span className={styles.quote}>{item.content}</span>
                {/* <div className={styles.author}>
                <span className={styles.authorInfo}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.title}>{item.title}</span>
                </span>
              </div> */}
              </blockquote>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
