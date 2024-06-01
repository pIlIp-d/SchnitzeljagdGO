import React, { useEffect } from 'react';
import { ui, uiConfig } from './firebaseConfig';
import 'firebaseui/dist/firebaseui.css';

const LoginView: React.FC = () => {
	useEffect(() => {
		// Render the FirebaseUI widget
		ui.start('#firebaseui-auth-container', uiConfig);
	}, []);

	return (
		<div>
			<h1>Welcome</h1>
			<div id="firebaseui-auth-container"></div>
			<div id="loader">Loading...</div>
		</div>
	);
};

export default LoginView;
