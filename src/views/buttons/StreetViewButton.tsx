import { Button, ButtonProps } from "@mui/material";


const StreetViewButton = (props: {
    latitude: number, longitude: number
} & Omit<ButtonProps, "onclick">) => {
    return <Button
        {...props}
        onClick={
            () => window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${props.latitude},${props.longitude}`, '_blank')
        }
    >
        Street View
    </Button>;
};

export default StreetViewButton;
