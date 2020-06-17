// split from the firebase for module injection for testing purposes
// TODO still not working though... it's manual switching for now

// online
// export default {
//   // apiKey: 'AIzaSyAzXp1-2WG3FWLiPr_TuD4GbeIu8Cu0RXs',
//   apiKey: 'AIzaSyAzXp1-2WG3FWLiPr_TuD4GbeIu8Cu0RXsxxxx',
//   authDomain: 'graphsketch-31bb2.firebaseapp.com',
//   databaseURL: 'https://graphsketch-31bb2.firebaseio.com',
//   packId: 'graphsketch-31bb2',
//   storageBucket: 'graphsketch-31bb2.appspot.com',
//   messagingSenderId: '923321855938'
// }

// offline (run src/server.js in firebase-local first)
export default {
  // databaseURL: 'ws://localhost:5000', // local serving
  databaseURL: 'localhost:5000', // testing
}
