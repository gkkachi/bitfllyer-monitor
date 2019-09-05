import React from 'react'
import firebase from 'firebase'
import { Button, Container } from '@material-ui/core'

import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

const App: React.FC = () => {
  const [user, setUser] = React.useState<firebase.User | null>()
  React.useEffect(() => firebase.auth().onAuthStateChanged(setUser), [])

  const provider = new firebase.auth.GoogleAuthProvider()
  const auth = firebase.auth()

  return <Container maxWidth="sm">
    <h2>React + Firebase + MaterialUI using CDN</h2>
    <Button {...{
      variant: "contained",
      color: user ? 'default' : 'primary',
      onClick: user ?
        () => auth.signOut().catch(console.error) :
        () => auth.signInWithPopup(provider).catch(console.error)
    }}>{user ? 'sign out' : 'sign in'}</Button>
    <p>
      <a href="https://qiita.com/K-Kachi/items/cff0c7fb1a84640c8ac0">Document</a>
    </p>
    {user ?
      <ul>
        {Object.entries(user.toJSON())
          .filter(([_, x]) => typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean')
          .map(([s, x]) => <li key={s}>{`${s}:\t${x}`}</li>)}
      </ul> :
      <p>Sign in, PLEASE!</p>
    }
  </Container>
}

export default App
