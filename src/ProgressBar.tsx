import { LinearProgressProps, Box, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function ProgressBar(props: LinearProgressProps & { current: number, max: number }) {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const current = Math.min(props.current, props.max);
        setProgress(current / props.max * 100);
    }, [props]);

    return <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{props.current}/{props.max}</Typography>
        </Box>
    </Box>
}

export default ProgressBar;