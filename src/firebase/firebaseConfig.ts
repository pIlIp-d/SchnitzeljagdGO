import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { getAuth } from 'firebase/auth';

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

// FirebaseUI config
export const uiConfig: firebaseui.auth.Config = {
	callbacks: {
		signInSuccessWithAuthResult: (authResult, redirectUrl) => {
			// User successfully signed in.
			// Return type determines whether we continue the redirect automatically
			// or whether we leave that to developer to handle.
			return true;
		},
		uiShown: () => {
			// The widget is rendered.
			// Hide the loader.
			document.getElementById('loader')!.style.display = 'none';
		},
	},
	signInFlow: 'popup', // Use popup for IDP Providers sign-in flow instead of the default redirect
	signInSuccessUrl: '/', // URL to redirect to after a successful sign-in
	signInOptions: ['password', 'phone'],
	tosUrl: '<your-tos-url>', // Provide your terms of service URL
	privacyPolicyUrl: '<your-privacy-policy-url>', // Provide your privacy policy URL
};

// Initialize the FirebaseUI Widget using Firebase.
export const ui = new firebaseui.auth.AuthUI(auth);
export { auth };
