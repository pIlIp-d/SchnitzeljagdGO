import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import QuestView from './views/QuestView';
import LoginView from './firebase/LoginView';
import { checkUserStatus } from './firebase/AuthStatus';

function App() {

	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		checkUserStatus()
			.then(({ user }) => {
				if (user) {
					setLoggedIn(true);
				} else {
					setLoggedIn(false);
				}
			})
			.catch(error => {
				console.error('Error checking user status:', error);
			});
	});


	return (
		<Router>
			{loggedIn ? (
				<Routes>
					<Route path="/login" element={<LoginView />} />
					<Route path="/" element={<QuestView />} />
				</Routes>
			) : (
				<LoginView />
			)}
		</Router>
	);
}

export default App;
