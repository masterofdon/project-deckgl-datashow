import React, { Component } from 'react';
import { render } from 'react-dom';
import MapComponent from './MapComponent';
import MapGL from 'react-map-gl';
import SO2LevelOverlay from './SO2LevelOverlay';
import { request as Request } from 'd3-request';
import { setTimeout } from 'timers';
import { start as StartPerf, end as EndPerf} from './Performancer';

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

const COLORS = [
    [16, 204, 10],
    [85, 204, 30],
    [132, 209, 33],
    [173, 209, 33],
    [209, 209, 33],
    [209, 173, 33],
    [209, 150, 33],
    [209, 106, 33],
    [209, 68, 33],
    [209, 33, 33],
    [137, 32, 178]
];

const colorScale = (value, bool) => {
    var colorSelected = {};
    if (value < 10) colorSelected = COLORS[0];
    else if (value < 20) colorSelected = COLORS[1];
    else if (value < 30) colorSelected = COLORS[2];
    else if (value < 40) colorSelected = COLORS[3];
    else if (value < 50) colorSelected = COLORS[4];
    else if (value < 60) colorSelected = COLORS[5];
    else if (value < 70) colorSelected = COLORS[6];
    else if (value < 80) colorSelected = COLORS[7];
    else if (value < 90) colorSelected = COLORS[8];
    else if (value < 100) colorSelected = COLORS[9];
    else colorSelected = COLORS[0];
    return bool == true ? [...colorSelected, 190] : [...colorSelected, 52];
}

const elevation = r => {
    if (r)
        return 50;
    return 0;
}

const opacity = r => {
    if (r)
        return 1;
    return 0.2;
}

const isNotNull = r => r != null && r != 'undefined';
const isNull = r => r == null || r === 'undefined'

var last_hovered_item = {};
var currently_selected_item = null;

export default class GeoJsonMapComponent extends MapComponent {
    constructor(props) {
        super(props);
        this.onItemSelected = this.props.onItemSelected;
        
        this.state = {
            viewport: this.props.viewport,
            data: null,
            currentEvent : null
        };
        this.loaddataurl = DATA_GEOJSON;
       //this._requestGeoJsonData.bind(this)();
        this.loadDataCallback = this._responseHandler.bind(this);
        this.startOperation('loaddata',2000);
        
    }

    _responseHandler(error,data){
        var jsonParsed = JSON.parse(data.response);
        var resultset = jsonParsed._embedded || jsonParsed.features;
        var features = [];
        for (var i = 0; i < resultset.length; i++) {
            features.push(resultset[i].data)
        }
        var object = {};
        object.features = features;
        var last = JSON.parse(JSON.stringify(object));
        //this.setState({ data: last });
        this.setState({data: jsonParsed , currentEvent : "EventRenderData"});
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

    componentWillMount(){
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.resize);
    }

    componentWillUpdate(nextProps, nextState){
        const {currentEvent} = nextState;
        if(currentEvent === 'EventRenderData'){
        }
    }

    componentDidUpdate(prevProps, prevState){
        const {currentEvent} = this.state;
        if(currentEvent === 'EventRenderData'){       
            this.state.currentEvent = null;
        }
    }

    _onHover(value) {
        var isInside = false;
        if (value.object == null) {
            isInside = false;
            var index = value.index;
            if (isNotNull(last_hovered_item)) {
                // Last check. We might have already select an area. If selected outing object should ne change the state.
                if (isNotNull(currently_selected_item) && value.index == currently_selected_item.index) {
                    return;
                }
                // Return the outing object to the unselected state.        
                this.state.data.features[last_hovered_item.index].properties.hovered = false;
                last_hovered_item = null;
            }
            else {
                //This is not the case. If we have a null [value.object] we MUST have [last_hovered_item].
                throw new Error();
            }

        } else {
            if (isNotNull(last_hovered_item) && isNotNull(last_hovered_item.properties)) {
                if (last_hovered_item.properties.name === value.object.properties.name) {
                    // We are still in the same polygon. Do nothing.
                    return;
                }
                else {
                    this.state.data.features[last_hovered_item.index].properties.hovered = false;
                }
            }
            isInside = true;
            last_hovered_item = value.object;
            last_hovered_item.index = value.index;
            this.state.data.features[value.index].properties.hovered = true
        }
        var xData = JSON.parse(JSON.stringify(this.state.data));
        this.setState({ data: xData, hovered: isInside });
    }

    _onClick(value) {
        if (value.object == null) {
            // Something wrong.
            return true;
        }

        if (currently_selected_item == null) {
            // There exists no selection. This is gonna be it.
        }
        else {
            // Selection already exists. Check if the selection is the same
            if (currently_selected_item.index == value.index) {
                // Do nothing
                return true;
            }
            this.state.data.features[currently_selected_item.index].properties.selected = false;
        }
        currently_selected_item = value.object;
        currently_selected_item.index = value.index;
        currently_selected_item.name = value.object.properties.name;
        this.state.data.features[currently_selected_item.index].properties.selected = true;
        var xData = JSON.parse(JSON.stringify(this.state.data));
        this.setState({ data: xData, selected: true });
        //this._zoomInToArea(value.lngLat, 13);
        this.onItemSelected(currently_selected_item);
        return true;
    }

    render() {
        const { data, hovered, selected, currentEvent } = this.state;
        if(currentEvent === 'EventRenderData'){
        }
        const {viewport} = this.props;
        return (
            <SO2LevelOverlay viewport={viewport}
                data={data}
                colorScale={colorScale}
                elevation={elevation}
                onHover={this._onHover.bind(this)}
                onClick={this._onClick.bind(this)}
                hovered={this.state.hovered}
                selected={this.state.selected}
            />                
        )
    }
}
