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
import SO2LevelOverlay from './so2-levels-overlay';
import HeatmapContainer from './components/HeatmapContainer';

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
};

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
    startZoomInAnimationTimer : null;
    var app_width = window.innerWidth;
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
      width: window.innerWidth,
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
    var {selectedGeoJsonItem, loadingState, percentage, viewport} = this.state;
    var isGeoJson = (this.state.maptype === 'geojson');
    if(!isGeoJson){
      selectedGeoJsonItem = null;
    }
    var isHexagon = (this.state.maptype === 'hexagon');
    var isScreengrid = (this.state.maptype === 'screengrid');
    var isHeatmap = (this.state.maptype === 'heatmap');
    
    
    
    return (
      <div>
        {isGeoJson && selectedGeoJsonItem && <GeoJsonInfoBox selecteditem={selectedGeoJsonItem} name={selectedGeoJsonItem.name} loadingState={loadingState} percentage={percentage} />}
        {isGeoJson && <GeoJsonMapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
        {isHexagon && <HexagonMapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
        {isScreengrid && <ScreenGridMapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
        {/* <MapGL
          {...viewport}
          mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>          
          {isGeoJson && <GeoJsonMapComponent onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
          {isHexagon && <HexagonMapComponent onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
          {isScreengrid && <ScreenGridMapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
        </MapGL>
        {isGeoJson && selectedGeoJsonItem && <GeoJsonInfoBox selecteditem={selectedGeoJsonItem} name={selectedGeoJsonItem.name} loadingState={loadingState} percentage={percentage} />} */}
        {isHeatmap && <HeatmapContainer onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
        <MapTypeController onChange={this.changeMapType.bind(this)}/>
      </div>
    );
  }
  
}
render(<Root/>, document.body.appendChild(document.createElement('div')));
