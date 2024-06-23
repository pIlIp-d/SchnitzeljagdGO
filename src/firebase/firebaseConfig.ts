import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
	apiKey: 'AIzaSyBlYYsGh-i9RgxjASU23aTsPuLnxYG5pA0',
	authDomain: 'schnitzeljagdgo.firebaseapp.com',
	projectId: 'schnitzeljagdgo',
	storageBucket: 'schnitzeljagdgo.appspot.com',
	messagingSenderId: '19025570477',
	appId: '1:19025570477:web:b2e3dbfb366c4d64fbb424',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

// FirebaseUI config
export const uiConfig: firebaseui.auth.Config = {
	callbacks: {
		signInSuccessWithAuthResult: () => {
			return true;
		},
		uiShown: () => {
			// The widget is rendered.
			// Hide the loader.
			document.getElementById('loader')!.style.display = 'none';
		},
	},
	signInFlow: 'popup',
	signInSuccessUrl: '/SchnitzeljagdGO/',
	signInOptions: ['password'],
	//tosUrl: '<your-tos-url>', // Provide your terms of service URL
	//privacyPolicyUrl: '<your-privacy-policy-url>', // Provide your privacy policy URL
};

export const ui = new firebaseui.auth.AuthUI(auth);
export { auth };
