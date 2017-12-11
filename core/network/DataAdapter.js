import { request as Request } from 'd3-request';
import { json as requestJson } from 'd3-request';
import { csv  as requestCsv } from 'd3-request';

export function ScreenGridDataAdapter(callback) {
    
    const DATA_URL = 'http://localhost:3030/istanbul_noise_pollution.json';
    requestJson(DATA_URL,callback);

}

export function RoadQualityDataAdapter(callback){
    const DATA_ROAD_QUALITY = "http://localhost:3030/final_points.csv";
    requestCsv(DATA_ROAD_QUALITY, callback);
}

export function GeoJsonDataAdapter(callback){
    const DATA_GRID = "https://217.78.97.241:30000/api/1.0/search";
    var PARAMS_GEOJSON = {};
    PARAMS_GEOJSON.size = 10000;
    PARAMS_GEOJSON.query = {};
    PARAMS_GEOJSON.query.match = {};
    PARAMS_GEOJSON.query.match.deviceId = "BarcelonaGeoJson";
    PARAMS_GEOJSON._source = {};
    PARAMS_GEOJSON._source.includes = ['data'];
    PARAMS_GEOJSON._source.excludes = [];
    const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line
    const DATA_GEOJSON = "http://localhost:3030/data.geojson";
    Request(DATA_GEOJSON)
    .header("Content-Type", "application/json")
    .header('Authorization', AUTH_TOKEN)
    .get(JSON.stringify(PARAMS_GEOJSON),callback);
}