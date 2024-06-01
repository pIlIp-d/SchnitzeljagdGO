import { LinearProgressProps, Box, LinearProgress, Typography } from "@mui/material";

function ProgressBar(props: LinearProgressProps & { current: number, max: number }) {
    return <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={props.current / props.max} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{props.current}/{props.max}</Typography>
        </Box>
    </Box>
}

export default ProgressBar;