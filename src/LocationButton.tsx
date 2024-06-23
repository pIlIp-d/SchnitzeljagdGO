import { Box, Button, CircularProgress, IconButton, Snackbar } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GpsOffIcon from '@mui/icons-material/GpsOff';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment, useEffect, useState } from 'react';
import OverlayButton from './views/OverlayButton';

interface LocationButtonParameters {
	loadLocation: () => void;
	loading: boolean;
	error: boolean;
}

const LocationButton: React.FC<LocationButtonParameters> = ({ loadLocation, loading, error }) => {
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	useEffect(() => {
		if (error) setSnackBarOpen(true);
	}, [error]);

	const action = (
		<Fragment>
			<Button color="primary" size="small" onClick={loadLocation}>
				RETRY
			</Button>
			<IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackBarOpen(false)}>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	return (
		<>
			<OverlayButton
				ariaLabel="reload-location"
				onClick={loadLocation}
				sx={{
					bottom: '30px',
					right: '15px',
				}}
				icon={
					error ? (
						<GpsOffIcon />
					) : loading ? (
						<Box >
							<CircularProgress size={'1em'} />
						</Box>
					) : (
						<MyLocationIcon />
					)
				}
			/>
			<Snackbar
				open={snackBarOpen}
				autoHideDuration={5000}
				onClose={() => setSnackBarOpen(false)}
				message="Error getting Location"
				action={action}
			/>
		</>
	);
};

export default LocationButton;
