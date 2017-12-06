/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import GeoJsonMapContainer from './components/GeoJsonMapContainer';
import ScreenGridMapContainer from './components/ScreenGridMapContainer';
import HexagonMapContainer from './components/HexagonMapContainer';
import GeoJsonInfoBox from './components/GeoJsonInfoBox';
import {json as requestJson} from 'd3-request';
import {csv as requestCsv} from 'd3-request';
import {request as Request} from 'd3-request'
import {geoContains as GeoContains} from 'd3-geo';
import {interpolateZoom as zoom} from 'd3-interpolate';
import {interpolateArray as arrayInterpolate} from 'd3-interpolate';
import {interpolateNumber as numberInterpolate} from 'd3-interpolate';
import MapTypeController from './components/MapTypeController';
import GeoJsonMapComponent from './components/GeoJsonMapComponent';
import HexagonMapComponent from './components/HexagonMapComponent';
import SO2LevelOverlay from './components/SO2LevelOverlay';
import HeatmapContainer from './components/HeatmapContainer';
import MapContainer from './components/MapContainer';

var seedrandom = require('seedrandom');
// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line
const test = true;
// Source data CSV
const DATA_URL = 'istanbul_noise_pollution.json';
const NOISE_POLLUTION = 'istanbul_noise_pollution.json';
const DATA_NOISE_POLLUTION = 'istanbul_noise_pollution.json';
const SO2_LEVEL_DATA_URL = 'data.json';
const DATA_SO2_LEVEL = 'data.json';
const FINAL_POINTS = "final_points.csv";
const DATA_ROAD_QUALITY = "final_points.csv";
const DATA_GEOJSON = "data.geojson";
const DATA_GRID = "https://217.78.97.241:30000/api/1.0/search";
const PARAMS_GRID = '{"size": 190347,"query": {"match":{"deviceId": "BarcelonaGrid"}},"_source":{"includes":["data"],"excludes":[]}}';
const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';

const MAPSTYLE_SCREENGRID = 0;
const MAPSTYLE_HEXAGON = 1;
const MAPSTYLE_SCATTERPLOT = 2;
const MAPSTYLE_GEOJSON = 3;

const MAPSTYLE = [
  'screengrid',
  'hexagon',
  'scatterplot',
  'geojson',
  'heatmap'
]

const MAPDATA = [
  DATA_NOISE_POLLUTION,
  DATA_ROAD_QUALITY,
  DATA_SO2_LEVEL
]

Math.seedrandom('added entropy.', { entropy: true });
function getRandomDouble(min,max){
	if(min == null || min == "undefined")
		min = 0;
	if(max == null || max == 'undefined')
		max = 100
	return Math.random() * (max - min) + min;
}

const isNotNull = r => r != null && r != 'undefined';
const noop = function(){};

var nextZoomLevel = 10;
var nextLngLat = [0,1];

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maptype : "heatmap",
      onClickHandler : this.props.onClick,
      viewport: {
          ...SO2LevelOverlay.defaultViewport,
          width: 200,
          height : 200
      }
    };    
  }

  componentDidMount() {
  }

  changeMapType(maptype){
    this.setState({
      maptype: maptype
    });
  }
  
  render() {
    var {viewport} = this.state;
    return (
      <div className={'row'}>
        <MapContainer maptype={this.state.maptype} mapstyle={"mapbox://styles/aerdemekin/cjaksz2udc14a2rqo9lshmsdc"}/>
        <MapTypeController onChange={this.changeMapType.bind(this)}/>
      </div>
    );
  }
  
}
var div = document.createElement('div');
render(<Root />, document.body.appendChild(div));
