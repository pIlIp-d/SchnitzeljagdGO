import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import QuestView from './views/QuestView';
import LoginView from './firebase/LoginView';
import { checkUserStatus } from './firebase/AuthStatus';

function App() {
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		checkUserStatus()
			.then(async ({ user }) => {
				if (user) {
					setUserId(user.uid);
				} else {
					setUserId(null);
				}
			})
			.catch(error => {
				console.error('Error checking user status:', error);
			});
	});

	return (
		<Router basename="/SchnitzeljagdGO/">
			{userId ? (
				<Routes>
					<Route path="/login" element={<LoginView />} />
					<Route path="/" element={<QuestView userId={userId} />} />
					<Route path="/quest/:questId" element={<QuestView userId={userId} />} />
				</Routes>
			) : (
				<LoginView />
			)}
		</Router>
	);
}

export default App;
