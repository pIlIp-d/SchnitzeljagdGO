import { Button, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

interface OSMButtonProps {
    wayID?: number;
    tagID?: string;
    nodeID?: number;
    showText?: boolean;
}
const OSMButton = ({ wayID, tagID, nodeID, showText = true }: OSMButtonProps) => {
    const open = () => {
        if (wayID)
            window.open(`https://www.openstreetmap.org/way/${wayID}`, '_blank')
        else if (nodeID)
            window.open(`https://www.openstreetmap.org/node/${nodeID}`, '_blank')
        else if (tagID)
            window.open(`https://taginfo.openstreetmap.org/keys/${tagID}#overview`, '_blank')
    }
    return <>
        {showText ?
            <Button
                onClick={open}
            >
                OSM Info
            </Button>
            :
            <IconButton onClick={open}>
                <InfoIcon />
            </IconButton>
        }
    </>;
};

export default OSMButton;
