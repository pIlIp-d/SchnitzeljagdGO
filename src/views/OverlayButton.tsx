import React from 'react';
import IconButton from '@mui/material/IconButton';
import { SxProps, Theme } from '@mui/system';

interface OverlayButtonProps {
    sx?: SxProps<Theme>;
    onClick: () => void;
    icon: React.ReactNode;
    ariaLabel: string;
}

const OverlayButton: React.FC<OverlayButtonProps> = ({ sx, onClick, icon, ariaLabel }) => {
    return (
        <IconButton
            aria-label={ariaLabel}
            onClick={onClick}
            className={"customOverlayIconButton"}
            sx={sx}
        >
            {React.cloneElement(icon as React.ReactElement, { className: "customOverlayIcon" })}
        </IconButton>
    );
};

export default OverlayButton;