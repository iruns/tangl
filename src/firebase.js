import * as firebase from 'firebase'
// import 'firebase/database'
// import 'firebase/auth'
import config from './configs/firebase'

export const firebaseApp = firebase.initializeApp(config)
export const db = firebaseApp.database()
// export const auth = firebaseApp.auth() // off on test
