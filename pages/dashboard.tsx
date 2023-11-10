import Head from 'next/head'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import styles from '../styles/base.module.css'
import { SingOutButton } from '../components/signoutButton/signoutButton'
import React, { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

function useHash(): string {
  const [currentHash, setCurrentHash] = useState('');

  const hashChangeHandler = () => {
      const hash =
          typeof window !== 'undefined' && window.location.hash
              ? window.location.hash
              : '';

      if (hash) {
          setCurrentHash(hash.replace("#", ""));
      } else {
          setCurrentHash('');
      }
  }

  useEffect(() => {
    hashChangeHandler();
    window.addEventListener('hashchange', hashChangeHandler);
    return () => {
        window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, []);

  return currentHash

}

function Home(props) {
  const Router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()
  const [popups, setPopups] = useState({
    properties: false,
  });
  const [lists, setLists] = useState([] as any[])
  const [tasks, setTasks] = useState([] as any[])
  const [metas, setMetas] = useState([] as any[])
  const [metaValues, setMetaValues] = useState([] as any[])
  const selectedList = useHash()
  
  useEffect(() => {
    async function getLists() {
      const { data: defaultLists, error } = await supabase.from('Lists').select('*').order('created_at')
      
      if (!error && defaultLists?.length) {
        setLists(defaultLists)
        
      } else {
        
        const { data: addedList, error } = await supabase
          .from('Lists')
          .insert([
            { 
              label: 'Default List',
              user_id: user?.id,
            },
          ])

          if (!error && addedList?.length) {
          setLists(addedList) 
        }
      }
    }

    if (user) { 
      getLists()
    }
  }, [user, supabase])

  useEffect(() => {
    if (!selectedList && lists.length) {
      Router.push(`#${lists[0].id}`)
    }

    if (selectedList) {
      getTasks(selectedList)
      getMetas(selectedList)
      getMetaValues()
    }
  },[lists, selectedList])

  async function refreshList() {
    const { data, error } = await supabase.from('Lists').select('*').order("created_at")
    if (!error && data?.length) {
      setLists(data)
    }
  }

  async function addList() {
    const { error } = await supabase
      .from('Lists')
      .insert([
        { 
          label: 'List Name',
          user_id: user?.id
        },
      ])
      if (!error) {
        refreshList()
      }
    
  }

  async function removeList(listId: string) {
    const { error: errorTasks } = await supabase
      .from('Tasks')
      .delete()
      .eq('list_id', listId)

    const { error: errorLists } = await supabase
      .from('Lists')
      .delete()
      .eq('id', listId)

      if (!errorTasks && !errorLists) {
        refreshList()
      }
  }

  async function updateList(label: string, listId: string) {
    const { error } = await supabase
      .from('Lists')
      .update({
        label
      })
      .eq('id', listId)
  }

  async function getTasks(listId: string) {
    const { data, error } = await supabase.from('Tasks').select('*').eq("list_id", listId).order("created_at")
    if (!error && data?.length) {
      setTasks(data)
    } else {
      const { data: addedTask, error } = await supabase
        .from('Tasks')
        .insert([
          { 
            title: 'Example task',
            list_id: selectedList,
            user_id: user?.id,
          },
        ])
        console.log({error})
        if (!error && addedTask?.length) {
          setTasks(addedTask) 
        }
    }
  }

  async function refreshTasks() {
    const { data, error } = await supabase.from('Tasks').select('*').eq("list_id", selectedList).order("created_at")
    if (!error && data?.length) {
      setTasks(data)
    }
  }  

  async function updateTask(title: string, taskId: string) {
    const { error } = await supabase
      .from('Tasks')
      .update({
        title
      })
      .eq('id', taskId)
  }

  async function addTask() {
    const { error } = await supabase
      .from('Tasks')
      .insert([
        { 
          title: 'Task title',
          list_id: selectedList,
          user_id: user?.id
        },
      ])

      if (!error) {
        refreshTasks()
      }
    
  }

  async function removeTask(taskId: string) {
    const { error } = await supabase
    .from('Tasks')
    .delete()
    .eq('id', taskId)

    if (!error) {
      refreshTasks()
    }
  }

  async function refreshMetas() {
    const { data, error } = await supabase.from('ListsMeta').select('*').eq("list_id", selectedList).order("created_at")
    if (!error && data?.length) {
      setMetas(data)
    }
  }  

  async function getMetas(listId: string) {
    const { data, error } = await supabase.from('ListsMeta').select('*').eq("list_id", listId).order("created_at")
    if (!error && data?.length) {
      setMetas(data)
    } else {
      const { data: addedMetas, error } = await supabase
        .from('ListsMeta')
        .insert([
          { 
            name: 'Story points',
            list_id: selectedList,
            user_id: user?.id,
          },
          { 
            name: 'Impact',
            list_id: selectedList,
            user_id: user?.id,
          },
        ])
        console.log({error})
        if (!error && addedMetas?.length) {
          setMetas(addedMetas) 
        }
    }
  }

  async function removeMeta(metaId: string) {
    const { error } = await supabase
    .from('ListsMeta')
    .delete()
    .eq('id', metaId)

    if (!error) {
      refreshMetas()
    }
  }

  async function updateMeta(name: string, metaId: string) {
    const { error } = await supabase
      .from('ListsMeta')
      .update({
        name
      })
      .eq('id', metaId)

      refreshMetas()
  }

  async function addMeta() {
    const { error } = await supabase
      .from('ListsMeta')
      .insert([
        { 
          name: 'Property name',
          list_id: selectedList,
          user_id: user?.id
        },
      ])

      if (!error) {
        refreshMetas()
      }
    
  }  

  async function getMetaValues() {
    const { data, error } = await supabase.from('TasksMetaValues')
      .select('*')
      .in("list_meta_id", metas.map(meta => meta.id))
      .in("task_id", tasks.map(task => task.id))
      .order("created_at")
    if (!error && data?.length) {
      setMetaValues(data)
    }
  }

  function refreshMetaValues() {
    getMetaValues()
  }

  function metaValueExists(taskId: string, metaId: string) {
    return metaValues.some(meta => meta.list_meta_id === metaId && meta.task_id === taskId)
  }

  function getTaskMetaValue(taskId: string, metaId: string) {
    return metaValues.find(meta => meta.list_meta_id === metaId && meta.task_id === taskId)?.value || 0
  }

  async function updateMetaValue(taskId: string, metaId: string, value: string) {
    if (metaValueExists(taskId, metaId)) {
    const { data, error } = await supabase
      .from('TasksMetaValues')
      .update({
        value,
      })
      .eq('list_meta_id', metaId)
      .eq('task_id', taskId)
      refreshMetaValues()
    } else {
      const { data, error } = await supabase
        .from('TasksMetaValues')
        .insert({
          list_meta_id: metaId,
          task_id: taskId,
          value,
          user_id: user?.id,
        })
        refreshMetaValues()
    }
  }

  async function updateFormula(axis: string, value: string) {
    
  }

  function openPopup(popupName: string) {
    setPopups({
      ...popups,
      [popupName]: true,
    })
  }

  function closePopup(popupName: string) {
    setPopups({
      ...popups,
      [popupName]: false,
    })
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Prioritizer</title>
        <meta name="description" content="Prioritize your tasks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        {popups.properties && <div className={styles.popup}>
          <div className={styles.popupContent}>
            
            <div className={styles.popupHeader}>
              <h2 className={styles.popupTitle}>Manage list properties</h2>
              <button onClick={() => { closePopup('properties') }}>x</button>
            </div>

            <div className={`${styles.items} ${styles.itemsProperties}`}>
                
                <div className={styles.itemHeader}>
                  <div>Property name</div>
                  <div></div>
                  <div></div>
                </div>

                {metas.map((meta) => 
                  <div key={meta.id} className={styles.item}>
                    <div 
                      contentEditable
                      onBlur={(e)=>{
                        updateMeta(e.target.innerText, meta.id)
                      }}
                    >{meta.name}</div>
                    <div><input type="checkbox" checked /></div>
                    <div>{metas.length > 2 && <button className={styles.itemRemove} onClick={() => { removeMeta(meta.id) }}>X</button>}</div>
                  </div>
                )}
                <div className={styles.popupButtons}>
                  <button 
                    className={styles.button} 
                    onClick={()=>{ addMeta() }}
                  >Add property</button>
                </div>
              </div>
          </div>
        </div>}
        
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.logo}>Prioritizer</h1>
          </div>
          <div className={styles.headerRight}>
            Nothing to show here yet
            <SingOutButton 
              label="Logout"
              className={styles.buttonSmall}
            />
          </div>
        </header>

        <div className={styles.tabs}>
          <ul className={styles.tabsList}>
            {
              lists.map((list) => 
                <li key={list.id}>
                  <a href={`#${list.id}`} className={selectedList === list.id ? styles.tabSelected : styles.tab}>
                    <div 
                      contentEditable
                      onBlur={(e) => {
                        updateList(e.target.innerText, list.id)
                      }}
                    >{list.label}</div>
                    {lists.length > 1 && <span className={styles.tabRemove} onClick={() => { removeList(list.id) }}>X</span>}
                  </a>
                </li>
              )
            }
            <li><div className={styles.tab} onClick={() => addList()}>+</div></li>
          </ul>
        </div>
        
        <div className={styles.container}>
          <aside className={styles.sidebar}>
              <div 
                style={{'--items-nr': metas.filter(meta => meta.visible).length} as React.CSSProperties}
                className={`${styles.items} ${styles.itemsTasks}`}>
                
                <div className={styles.itemHeader}>
                  <div>Task name</div>
                  {metas.filter(meta => meta.visible).map(meta => <div key={meta.id}>{meta.name}</div>)}
                  <div>
                    <button onClick={() => { openPopup('properties') }}>+</button>
                  </div>
                </div>

                {tasks.map((task) => 
                  <div key={task.id} className={styles.item}>
                    <div 
                      contentEditable
                      onBlur={(e)=>{
                        updateTask(e.target.innerText, task.id)
                      }}
                    >{task.title}</div>
                    {metas.filter(meta => meta.visible).map(meta => 
                      <div 
                        key={`${task.id}-${meta.id}`} 
                        contentEditable
                        onBlur={(e) => { updateMetaValue(task.id, meta.id, e.target.innerText) }}
                      >{getTaskMetaValue(task.id, meta.id)}</div>
                    )}
                    <div>{tasks.length > 1 && <button className={styles.itemRemove} onClick={() => { removeTask(task.id) }}>X</button>}</div>
                  </div>
                )}
                  
              </div>

              <div className={styles.buttons}>
                <button 
                  className={styles.button} 
                  onClick={()=>{ addTask() }}
                >Add tasks</button>
              </div>

              <div className={styles.info}>
                You can use any of the properties set for tasks like (click to copy)
              </div>
              <div className={styles.metaLabels}>
                  {metas.map(meta => 
                    <span 
                      key={`label-${meta.id}`} 
                      className={styles.metaLabel}
                      onClick={() => { navigator.clipboard.writeText(`[${meta.name}]`); }}
                    >
                      {`[${meta.name}]`}
                    </span>
                  )}
              </div>
              <div className={styles.axis}>
                <div>
                  <div>X axis</div>
                  <div contentEditable onBlur={(e) => updateFormula('x', e.target.innerText)}>Complexity</div>
                </div>
                <div>
                  <div>Y axis</div>
                  <div contentEditable onBlur={(e) => updateFormula('y', e.target.innerText)}>Impact</div>
                </div>
                <div>
                  <div>Bubble Size</div>
                  <div contentEditable onBlur={(e) => updateFormula('size', e.target.innerText)}>Complexity</div>
                </div>
              </div>

              <div className={styles.buttonsBottom}>
                <button className={styles.button}>Import tasks</button>
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

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

export default Home