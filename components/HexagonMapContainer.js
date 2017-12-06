import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import RoadQualityOverlay from './RoadQualityOverlay.js'
import {json as requestJson} from 'd3-request';
import {request as Request} from 'd3-request'
import {csv as requestCsv} from 'd3-request';
import { request } from 'https';

const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line
const DATA_ROAD_QUALITY = "final_points.csv";
var PARAMS_GEOJSON = {};
PARAMS_GEOJSON.size = 10000;
PARAMS_GEOJSON.query = {};
PARAMS_GEOJSON.query.match = {};
PARAMS_GEOJSON.query.match.deviceId = "BarcelonaGeoJson";
PARAMS_GEOJSON._source = {};
PARAMS_GEOJSON._source.includes = ['data'];
PARAMS_GEOJSON._source.excludes = [];

export default class HexagonMapContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            viewport: {
                ...RoadQualityOverlay.defaultViewport,
                width: 200,
                height : 200
            },
            data: null,

        };
        
    }

    _reponseHandler(error,response){
        // var jsonParsed = JSON.parse(data.response);
        // var resultset = jsonParsed._embedded || jsonParsed.features;
        // var features = [];
        // for (var i = 0; i < resultset.length; i++) {
        //     features.push(resultset[i].data)
        // }
        // var object = {};
        // object.features = features;
        // var last = JSON.parse(JSON.stringify(object));
        // this.setState({ data: last });
        const jsonParsed = response.map(d => ([Number(d.lng), Number(d.lat)]));
        this.setState({data: jsonParsed});
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight * 0.90
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
        requestCsv(DATA_ROAD_QUALITY, this._reponseHandler.bind(this));
    }

    render(){
        const {viewport, data} = this.state;
        const containerStyle = {
            marginTop : "20px",
            marginLeft: "10px"
        };
        const canvasStyle = {
            width : "300px"
        };
        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
                onViewportChange={this._onViewportChange.bind(this)}
                mapboxApiAccessToken={MAPBOX_TOKEN}>
                <RoadQualityOverlay
                    viewport={viewport}
                    data={data || []}
                />
            </MapGL>
        );
    }

}