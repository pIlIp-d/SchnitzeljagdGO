import { Button, ButtonProps } from "@mui/material";


const OSMButton = (props: {
    wayID: number;
} & Omit<ButtonProps, "onclick">) => {
    return <Button
        {...props}
        onClick={
            () => window.open(`https://www.openstreetmap.org/way/${props.wayID}`, '_blank')
        }
    >
        OSM Info
    </Button>;
};

export default OSMButton;
