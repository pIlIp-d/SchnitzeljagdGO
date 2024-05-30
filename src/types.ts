export type NodeElement = {
    type: string;
    id: number;
    lat: number;
    lon: number;
  };

export type OSMData = {
    version: number;
    generator: string;
    osm3s: {
      timestamp_osm_base: string;
      copyright: string;
    };
    elements: (NodeElement)[];
  };