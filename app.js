/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import GeoJsonMapContainer from './components/GeoJsonMapContainer';
import GeoJsonInfoBox from './components/GeoJsonInfoBox';
import {json as requestJson} from 'd3-request';
import {csv as requestCsv} from 'd3-request';
import {request as Request} from 'd3-request'
import {geoContains as GeoContains} from 'd3-geo';
import {interpolateZoom as zoom} from 'd3-interpolate';
import {interpolateArray as arrayInterpolate} from 'd3-interpolate';
import {interpolateNumber as numberInterpolate} from 'd3-interpolate';
import MapTypeController from './components/MapTypeController';

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
var PARAMS2_GRID = {};
PARAMS2_GRID.size = 190347;
PARAMS2_GRID.query = {};
PARAMS2_GRID.query.match = {};
PARAMS2_GRID.query.match.deviceId = "BarcelonaGrid";
PARAMS2_GRID._source = {};
PARAMS2_GRID._source.includes = ['data'];
PARAMS2_GRID._source.excludes = [];
var PARAMS_GEOJSON = {};
PARAMS_GEOJSON.size = 10000;
PARAMS_GEOJSON.query = {};
PARAMS_GEOJSON.query.match = {};
PARAMS_GEOJSON.query.match.deviceId = "BarcelonaGeoJson";
PARAMS_GEOJSON._source = {};
PARAMS_GEOJSON._source.includes = ['data'];
PARAMS_GEOJSON._source.excludes = [];
var PARAMS_HEXAGON = {};
PARAMS_HEXAGON.size = 10000;
PARAMS_HEXAGON.query = {};
PARAMS_HEXAGON.query.match = {};
PARAMS_HEXAGON.query.match.deviceId = "BarcelonaHexagon";
PARAMS_HEXAGON._source = {};
PARAMS_HEXAGON._source.includes = ['data'];
PARAMS_HEXAGON._source.excludes = [];

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
]

const colorScale = r => [r * 255, 140, 200 * (1 - r)];
const colorScale2 = (value,bool) => {
  var colorSelected = {};
  if(value < 10) colorSelected = COLORS[0];
  else if(value < 20) colorSelected = COLORS[1];
  else if(value < 30) colorSelected = COLORS[2];
  else if(value < 40) colorSelected = COLORS[3];
  else if(value < 50) colorSelected = COLORS[4];
  else if(value < 60) colorSelected = COLORS[5];
  else if(value < 70) colorSelected = COLORS[6];
  else if(value < 80) colorSelected = COLORS[7];
  else if(value < 90) colorSelected = COLORS[8];
  else if(value < 100) colorSelected = COLORS[9];
  else colorSelected = COLORS[0];
  return bool == true ? [...colorSelected , 190] : [...colorSelected , 52];
}
const elevation = r => {
  if(r)
  return 50;
  return 0;
}

const opacity = r=> {
  if(r)
  return 1;
  return 0.2;
}

const MAPSTYLE_SCREENGRID = 0;
const MAPSTYLE_HEXAGON = 1;
const MAPSTYLE_SCATTERPLOT = 2;
const MAPSTYLE_GEOJSON = 3;

const MAPSTYLE = [
  'screengrid',
  'hexagon',
  'scatterplot',
  'geojson'
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

var last_hovered_item = {};
var last_selected_item = {};
var currently_selected_item = null;
var nextZoomLevel = 10;
var nextLngLat = [0,1];

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maptype : "geojson",
      onClickHandler : this.props.onClick
    };
    startZoomInAnimationTimer : null;
    var app_width = window.innerWidth * 0.99;
    var app_height = window.innerHeight * 0.90;
    
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _zoomInToArea(lnglat , zoomLevel){
    nextZoomLevel = zoomLevel;
    nextLngLat = lnglat;
    var i = arrayInterpolate([this.state.viewport.longitude , this.state.viewport.latitude] , [lnglat[0],lnglat[1]]);
    var zoom = numberInterpolate(this.state.viewport.zoom,nextZoomLevel);
    for(var x = 1.0;x < 11.0;x+=1.0){
      var dd = i(x/10);
      var kk = zoom(0.1 * x);
      var vvv = [...dd,kk]
      this.startZoomInAnimationTimer = window.setTimeout(this._animateZoomIn.bind(this)(vvv),x * 50.0);
    }
    
  }

  _animateZoomIn(latlngzoom){ 
    this.setState({
      viewport : { ...this.state.viewport , zoom : latlngzoom[2] , longitude : latlngzoom[0] , latitude : latlngzoom[1] }
    });    
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth * 0.99,
      height: window.innerHeight * 0.90 
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _objectSelected(){
     
  }

  _onGeoJsonItemSelected(selectedItem){
    var x = Math.random();
    this.setState({
      selectedGeoJsonItem : selectedItem,
      loadingState : 'loading',
      percentage : x
    });
    if(test){
      setTimeout(function(e){
        this._onGeoJsonItemDataLoaded.bind(this)();
      }.bind(this),4000);
    }
  }

  _onGeoJsonItemUnselected(){
    this.setState({
      selectedGeoJsonItem : null,
      loadingState : 'stopped'
    });
  }

  _onGeoJsonItemDataLoaded(){
    this.setState({
      loadingState : 'loaded'
    });
    setTimeout(function(e){
      this.setState({
        loadingState : 'finished'
      });
    }.bind(this),4000);
  }

  changeMapType(maptype){
    this.setState({
      maptype: maptype
    });
  }
  
  render() {
    const {selectedGeoJsonItem, loadingState, percentage} = this.state;
    if(this.state.maptype === "screengrid"){
      <ScreenGridMapContainer />
    }
    else if(this.state.maptype === "hexagon"){
      return(
        <HexagonMapContainer />
      );
    }
    else if(this.state.maptype === 'geojson'){
      return (
        <div>
          {selectedGeoJsonItem  && <GeoJsonInfoBox selecteditem={selectedGeoJsonItem} name={selectedGeoJsonItem.name} loadingState={loadingState} percentage={percentage}/>}
          <GeoJsonMapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />
          <MapTypeController />
        </div>
      );
    }
  }
  
}
render(<Root/>, document.body.appendChild(document.createElement('div')));
