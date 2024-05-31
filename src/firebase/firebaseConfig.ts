import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import firebaseui from 'firebaseui';
import { getAuth, EmailAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
	apiKey: 'AIzaSyBR12MY0Kpwiq_qhjFdzb7q1FVYI57Sqbs',
	authDomain: 'schnitzeljagtgo.firebaseapp.com',
	projectId: 'schnitzeljagtgo',
	storageBucket: 'schnitzeljagtgo.appspot.com',
	messagingSenderId: '567330907978',
	appId: '1:567330907978:web:9385a41908f442c0e843b3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const uiConfig = {
	signInSuccessUrl: '/',
	signInOptions: [EmailAuthProvider.PROVIDER_ID],
};

export const ui = new firebaseui.auth.AuthUI(auth);
