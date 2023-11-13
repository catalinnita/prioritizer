import Head from 'next/head'
import styles from '../styles/base.module.css'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Prioritizer</title>
        <meta name="description" content="Prioritize your tasks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      Here comes the website    
    </div>
        
  )
}
