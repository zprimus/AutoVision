import * as firebase from 'firebase';

let config = {
	    apiKey: 'AIzaSyCzj_wyD_DkLEX1Dx8DEFg31QmouQepurQ',
	    authDomain: 'autonationinventory.firebaseapp.com',
	    databaseURL: 'https://autonationinventory.firebaseio.com',
	    projectId: 'autonationinventory',
	    storageBucket: 'autonationinventory.appspot.com',
	    messagingSenderId: '556573077007'
};

firebase.initializeApp(config);

export default firebase;