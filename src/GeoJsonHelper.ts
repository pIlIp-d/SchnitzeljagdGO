import axios from 'axios';
import { BuildingType, NodeElement, OSMData, QueryResult, WayElement } from './types';

const queryOverpass = (query: string) => {
    return axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`);
};

export const fetchGeoJSON = (selector: string, position: [number, number], radius: number): Promise<OSMData> => {
    return new Promise((resolve, reject) => {
        const [latitude, longitude] = position;
        try {
            queryOverpass(
                `[out:json];
                (
                    nwr(around:${radius},${latitude},${longitude})${selector};
                );
                out body;
                >;
                out skel qt;`
            ).then((response) => resolve(response.data));
        } catch (err) {
            reject(err as string);
        }
    });
};

export const fetchNodes = async (selector: string, position: [number, number], radius: number): Promise<QueryResult> => {
    const rawGeoJSONData = await fetchGeoJSON(selector, position, radius);
    const ways = rawGeoJSONData.elements.filter(node => node.type === 'way');
    return {
        ways: ways as WayElement[],
        nodes: rawGeoJSONData.elements.filter(node => node.type === 'node') as NodeElement[],
    };
};

export const getBuildingTypesInRadius = async (
    position: [number, number],
    minimumOccurences: number,
    maximumOccurences: number,
    radius: number
) => {
    const [latitude, longitude] = position;

    const response = await queryOverpass(`
        [out:json][timeout:25];
        nwr(around:${radius},${latitude},${longitude})[building];
        for (t["building"])
        {
        make stat building=_.val,
            count=count(ways);
        out;
        }`);

    return (response.data.elements as BuildingType[]).filter(
        e => minimumOccurences <= e.tags.count && e.tags.count <= maximumOccurences
    );
};
