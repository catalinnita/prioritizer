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
        
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.logo}>Prioritizer</h1>
          </div>
          <div className={styles.headerRight}>
            Nothing to show here yet
          </div>
        </header>

        <div className={styles.tabs}>
          <ul className={styles.tabsList}>
            <li><a href="#" className={styles.tabSelected}>Default list</a></li>
            <li><a href="#" className={styles.tab}>Another List name</a></li>
            <li><a href="#" className={styles.tab}>+</a></li>
          </ul>
        </div>
        
        <div className={styles.container}>
          <aside className={styles.sidebar}>
              <div className={styles.items}>
                <div className={styles.item}>
                  <div>Task name</div>
                  <div>Complexity</div>
                  <div>Impact</div>

                  <div>Something to do</div>
                  <div>10</div>
                  <div>2</div>

                  <div>Another task name with some very long title</div>
                  <div>5</div>
                  <div>5</div>
                </div>
              </div>

              <div className={styles.buttons}>
                <button className={styles.button}>Add tasks</button>
              </div>

              <div className={styles.buttonsBottom}>
                <button className={styles.button}>Add tasks</button>
              </div>

          </aside>
          <div className={styles.content}>
            <main className={styles.main}>
              <h1 className={styles.title}>Something here</h1>
              <div className={styles.chart}>

              </div>
            </main>
            <footer className={styles.footer}>&copy; piroritizer 2022</footer>
          </div>
        </div>
      </div>
        
  )
}
