import React from 'react'
import firebase from 'firebase'
import { Button, Container, Typography, List, ListItem, ListItemText } from '@material-ui/core'

import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

const kvNested = (obj: Object, prefix = '') => {
  let res: [string, string][] = []
  Object.entries(obj).forEach(([k, v]) => {
    const key = prefix + '/' + k
    switch (typeof v) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
        res.push([key, v.toString()])
        break
      case "object":
        if (v) {
          res = res.concat(kvNested(v, key))
        } else {
          res.push([key, 'null'])
        }
        break
      default:
        res.push([key, typeof v])
    }
  })
  return res
}

const App: React.FC = () => {
  const [user, setUser] = React.useState<firebase.User | null>()
  React.useEffect(() => firebase.auth().onAuthStateChanged(setUser), [])
  const provider = new firebase.auth.GoogleAuthProvider()
  const auth = firebase.auth()

  return <Container maxWidth="lg">
    <Typography variant="h2">React + Firebase + MaterialUI using CDN</Typography>
    <Typography variant="h4" component="p"><a href="https://qiita.com/K-Kachi/items/cff0c7fb1a84640c8ac0">Document</a></Typography>
    <Button {...{
      variant: "contained",
      color: user ? 'default' : 'primary',
      onClick: user ?
        () => auth.signOut().catch(console.error) :
        () => auth.signInWithPopup(provider).catch(console.error)
    }}>{user ? 'sign out' : 'sign in'}</Button>
    {user ?
      <List>
        {kvNested(user.toJSON())
          .map(([s, x]) => <ListItem key={s}><ListItemText primary={s} secondary={x} /></ListItem>)}
      </List> :
      <Typography variant="h4" component="p">Sign in, PLEASE!</Typography>
    }
  </Container>
}

export default App
