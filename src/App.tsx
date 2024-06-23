import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import QuestView from './views/QuestView';
import LoginView from './firebase/LoginView';
import UserDetails from './UserDetails';
import { checkUserStatus, signOut } from './firebase/AuthStatus';

function App() {
	const [userId, setUserId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkUserStatus()
			.then(({ user }) => {
				if (user) {
					setUserId(user.uid);
				} else {
					setUserId(null);
				}
				setLoading(false);
			})
			.catch(error => {
				console.error('Error checking user status:', error);
				setLoading(false);
			});
	}, []);

	const handleLogout = async () => {
		await signOut();
		setUserId(null);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Router basename="/SchnitzeljagdGO">
			<Routes>
				{userId ? (
					<>
						<Route path="/" element={<QuestView userId={userId} />} />
						<Route path="/userdetails" element={<UserDetails onLogout={handleLogout} />} />
						<Route path="/quest/:questId" element={<QuestView userId={userId} />} />
						<Route path="*" element={<Navigate to="/" />} />
					</>
				) : (
					<>
						<Route path="/login" element={<LoginView />} />
						<Route path="*" element={<Navigate to="/login" />} />
					</>
				)}
			</Routes>
		</Router>
	);
}

export default App;
