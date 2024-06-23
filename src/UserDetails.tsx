import React, { useState } from 'react';
import { auth } from './firebase/firebaseConfig';
import { sendPasswordResetEmail, updateEmail, updatePassword, User } from 'firebase/auth';
import { Button, Snackbar, TextField } from '@mui/material';

interface UserDetailsProps {
	onLogout: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ onLogout }) => {
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [passwordSuccess, setPasswordSuccess] = useState(false);
	const [emailSuccess, setEmailSuccess] = useState(false);
	const [passwordResetMessage, setPasswordResetMessage] = useState('');

	const getUser = (): User | null => {
		return auth.currentUser;
	};

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		const user = getUser();
		if (!user) {
			setError('User not authenticated');
			return;
		}

		try {
			await updatePassword(user, newPassword);
			setPasswordSuccess(true);
			setNewPassword('');
			setConfirmPassword('');
			setError(null);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleChangeEmail = async () => {
		const user = getUser();
		if (!user) {
			setError('User not authenticated');
			return;
		}

		try {
			await updateEmail(user, newEmail);
			setEmailSuccess(true);
			setNewEmail('');
			setError(null);
		} catch (error) {
			setError(error.message);
		}
	};

	const handlePasswordReset = async () => {
		const user = getUser();
		if (!user) {
			setError('User not authenticated');
			return;
		}

		if (user.email) {
			try {
				await sendPasswordResetEmail(auth, user.email);
				setResetEmailSent(true);
				setPasswordResetMessage('Password reset email sent to your email address.');
				setError(null);
			} catch (error) {
				setError(error.message);
			}
		} else {
			setError('User email is not available');
		}
	};

	const handleCloseSnackbar = () => {
		setPasswordSuccess(false);
		setEmailSuccess(false);
		setError(null);
	};

	return (
		<div>
			<h1>User Details</h1>
			<p>Email: {getUser()!.email}</p>

			<h2>Change Password</h2>
			<TextField
				type="password"
				label="New Password"
				value={newPassword}
				onChange={e => setNewPassword(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<TextField
				type="password"
				label="Confirm Password"
				value={confirmPassword}
				onChange={e => setConfirmPassword(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<Button variant="contained" onClick={handleChangePassword}>
				Change Password
			</Button>
			{error && <Snackbar open={true} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />}
			{passwordSuccess && (
				<Snackbar
					open={true}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					message="Password changed successfully!"
				/>
			)}

			<h2>Change Email</h2>
			<TextField
				type="email"
				label="New Email"
				value={newEmail}
				onChange={e => setNewEmail(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<Button variant="contained" onClick={handleChangeEmail}>
				Change Email
			</Button>
			{error && <Snackbar open={true} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />}
			{emailSuccess && (
				<Snackbar
					open={true}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					message="Email changed successfully!"
				/>
			)}

			<h2>Forgot Password?</h2>
			{!resetEmailSent ? (
				<Button variant="contained" onClick={handlePasswordReset}>
					Send Password Reset Email
				</Button>
			) : (
				<Button variant="contained" color="success">
					Send Password Reset Email
				</Button>
			)}
			{resetEmailSent && (
				<Snackbar open={true} autoHideDuration={6000} onClose={handleCloseSnackbar} message={passwordResetMessage} />
			)}

			<br />
			<Button variant="contained" onClick={onLogout}>
				Logout
			</Button>
		</div>
	);
};

export default UserDetails;
