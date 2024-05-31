import React, { useEffect } from 'react';
import { ui, uiConfig } from './firebaseConfig';
import 'firebaseui/dist/firebaseui.css';

const FirebaseAuthUI = () => {
	useEffect(() => {
		ui.start('#firebaseui-auth-container', uiConfig);
	}, []);

	return (
		<div>
			<h1>Login</h1>
			<div id="firebaseui-auth-container"></div>
		</div>
	);
};

export default FirebaseAuthUI;
