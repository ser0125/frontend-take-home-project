import Image from 'next/image'
import styles from './page.module.css'
import CanvasDrawer from './components/CanvasDrawer/CanvasDrawer'

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.code}>
        <p>Frontend Engineer Take Home Project</p>
      </div>
      
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/classkick.png"
          alt="Classkick Logo"
          width={200}
          height={50}
          priority
        />
      </div>
      <CanvasDrawer />
    
    </main>
  )
}
