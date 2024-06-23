import { auth } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export const checkUserStatus = (): Promise<{ user: User | null; accessToken: string | null }> => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(
			auth,
			user => {
				if (user) {
					user
						.getIdToken()
						.then(token => {
							resolve({ user, accessToken: token });
						})
						.catch(error => {
							reject(error);
						});
				} else {
					resolve({ user: null, accessToken: null });
				}
			},
			error => {
				reject(error);
			}
		);
	});
};

export const signOut = async (): Promise<void> => {
	await auth.signOut();
};
