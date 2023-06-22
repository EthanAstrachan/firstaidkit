import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import type { Applicant } from './api/lib/applicant'

const Home: NextPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [newUser, setNewUser] = useState<Applicant>({name: '', phone: ''});
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    (async () => {
      await updateApplicants()
    })();
  }, []);

  const submitNewUser = async () => {
    const request = await fetch('api/submitNewUser', {method: "POST", body: JSON.stringify(newUser)})
    if (request.status === 500) {
      const {message} = await request.json()
      setError(message)
    } else {
      navigateBack()
    }
    await updateApplicants()
  }

  const navigateBack = () => {
    setShowModal(false)
    setError(null);
  }

  const updateApplicants = async () => {
    setApplicants(await (await fetch('/api/all')).json() as Applicant[]);
  }

  const renderTable = () => {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>
          (First) AidKit Task
        </h1>
        <ul className={styles['applicant-list']}>
          {applicants.map(a => <li className={styles.applicant} key={a.name}>
            <div className={styles.name}>{a.name}</div>
            <div className={styles.phone}>{a.phone}</div>
          </li>
          )}
        </ul>
        <button onClick={() => setShowModal(true)}>Add new user</button>
      </main>
    )
  }

  const renderAddUserModal = () => {
    return (
      <main className={styles.main}>
        <div>
          <span>New user name: </span>
          <input type="text" onChange={(e) => setNewUser({...newUser, name: e.target.value})}/>
        </div>
        <div>
          <span>New user phone: </span>
          <input type="text" onChange={(e) => setNewUser({...newUser, phone: e.target.value})}/>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={navigateBack}>Go back</button>
          <button className={styles.button} onClick={submitNewUser}>Add user</button>
        </div>
        <div className={styles.errorMessage}>
          {error ?? error}
        </div>
      </main>
    )    
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>FirstAidKit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        showModal ? renderAddUserModal() : renderTable()
      }
      
    </div>
  )
}

export default Home
