import { Button } from "@mui/material";


interface StreetViewButton {
    latitude: number;
    longitude: number;
}
const StreetViewButton = ({ latitude, longitude }: StreetViewButton) => {
    return <Button
        onClick={
            () => window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`, '_blank')
        }
    >
        Street View
    </Button>;
};

export default StreetViewButton;
