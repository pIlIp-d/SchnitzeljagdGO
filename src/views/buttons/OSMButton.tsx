import { Button } from "@mui/material";


interface OSMButtonProps {
    wayID: number;
}
const OSMButton = ({ wayID }: OSMButtonProps) => {
    return <Button
        onClick={
            () => window.open(`https://www.openstreetmap.org/way/${wayID}`, '_blank')
        }
    >
        OSM Info
    </Button>;
};

export default OSMButton;
