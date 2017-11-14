/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import RoadQualityOverlay from './RoadQualityOverlay.js'
import SO2LevelOverlay from './so2-levels-overlay.js'
import TopLeftIconButton from './components/TopLeftIconButton.js'
import {json as requestJson} from 'd3-request';
import {csv as requestCsv} from 'd3-request';
import {request as Request} from 'd3-request'
import {geoContains as GeoContains} from 'd3-geo';
import {interpolateZoom as zoom} from 'd3-interpolate';
import {interpolateArray as arrayInterpolate} from 'd3-interpolate';
import {interpolateNumber as numberInterpolate} from 'd3-interpolate';

var seedrandom = require('seedrandom');
// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line

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
const PARAMS_GRID = '{"size": 190347,"query": {"match":{"deviceId": "BarcelonaGrid"}},"_source":{"includes":["data"],"excludes":[]}}'
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
      viewport: {
        ...SO2LevelOverlay.defaultViewport,
        width: 200,
        height: 200
      },
      
      data: null,
      type : "geojson2",
      selected : "false",
      hovered : "false",
      onClickHandler : this.props.onClick
    };
    startZoomInAnimationTimer : null;
    var app_width = window.innerWidth * 0.99;
    var app_height = window.innerHeight * 0.75;

    if(this.state.type === "screengird"){
      requestJson(DATA_URL, (error, response) => {
        //console.log(response);
        if (!error) {
          this.setState({data: response});
        }
      });
    } else if(this.state.type === "hexagon"){
      requestCsv(FINAL_POINTS, (error, response) => {
        //console.log(response);
        if (!error) {
          const data = response.map(d => ([Number(d.lng), Number(d.lat)]));
          this.setState({data});
        }
      });
    } else if(this.state.type === 'geojson'){
      requestJson(DATA_GEOJSON,(error,response) => {
        //console.log("Feat\r\n" + response);
        if (!error) {
          var len = (response.features != null && response.features != 'undefined') ? response.features.length : 0;
          for(var i = 0;i < len;i++){
            response.features[i].properties.growth = getRandomDouble(0,100);
            response.features[i].properties.selected = false;
            response.features[i].properties.hovered = false;
          }
          this.setState({data: response});
        }
      });
    } else if(this.state.type === 'geojson2'){
      Request(DATA_GRID)
        .header("Content-Type", "application/json")
        .header('Authorization', 'Bearer f4b2e853-0d6f-4413-b583-a243e1060a81')
        .post(JSON.stringify(PARAMS_GEOJSON),function(error,data){
          var jsonParsed = JSON.parse(data.response);
          var resultset = jsonParsed._embedded.result;
          var features = [];
          for(var i = 0; i < resultset.length;i++){
            features.push(resultset[i].data)
          }
          var object = {};
          object.features = features;
          var last = JSON.parse(JSON.stringify(object))
          this.setState({data : last});
      });
    } else if(this.state.type === 'hexagon2'){
      Request(DATA_GRID)
        .header("Content-Type", "application/json")
        .header('Authorization', 'Bearer f4b2e853-0d6f-4413-b583-a243e1060a81')
        .post(JSON.stringify(PARAMS_HEXAGON),function(error,data){
          var jsonParsed = JSON.parse(data.response);
          var resultset = jsonParsed._embedded.result;
          var features = [];
          for(var i = 0; i < resultset.length;i++){
            features.push(resultset[i].data)
          }
          var object = {};
          object.features = features;
          var last = JSON.parse(JSON.stringify(object))
          this.setState({data : last});
      });
    } else if(this.state.type === 'screengrid2'){
      Request(DATA_GRID)
        .header("Content-Type", "application/json")
        .header('Authorization', 'Bearer f4b2e853-0d6f-4413-b583-a243e1060a81')
        .post(JSON.stringify(PARAMS2_GRID),function(error,data){
          console.error(error);
          if (!error) {
            var len = (response.features != null && response.features != 'undefined') ? response.features.length : 0;
            for(var i = 0;i < len;i++){
              response.features[i].properties.growth = getRandomDouble(0,100);
              response.features[i].properties.selected = false;
              response.features[i].properties.hovered = false;
            }
            this.setState({data: response});
          }
            
      });
    }
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
      height: window.innerHeight * 0.75
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onHover(value){
    var isInside = false;
    if(value.object == null) {
      isInside = false;
      var index = value.index;
      if(isNotNull(last_hovered_item)){
        // Last check. We might have already select an area. If selected outing object should ne change the state.
        if(isNotNull(currently_selected_item) && value.index == currently_selected_item.index){
          return;
        }
        // Return the outing object to the unselected state.        
        this.state.data.features[last_hovered_item.index].properties.hovered = false;
        last_hovered_item = null;
      }
      else{
        //This is not the case. If we have a null [value.object] we MUST have [last_hovered_item].
        throw new Error();
      }
      
    } else {
      if(isNotNull(last_hovered_item) && isNotNull(last_hovered_item.properties)){
        if(last_hovered_item.properties.name === value.object.properties.name) { 
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
    this.setState({ data : xData , hovered : isInside });
  }

  _onClick(value){
    if(value.object == null) {
      // Something wrong.
      return true;
    }

    if(currently_selected_item == null){
      // There exists no selection. This is gonna be it.
    }
    else {
      // Selection already exists. Check if the selection is the same
      if(currently_selected_item.index == value.index){
        // Do nothing
        return true;
      }
      this.state.data.features[currently_selected_item.index].properties.selected = false; 
      
    }
    currently_selected_item = value.object;
    currently_selected_item.index = value.index;
    this.state.data.features[currently_selected_item.index].properties.selected = true;
    var xData = JSON.parse(JSON.stringify(this.state.data));
    this.setState({ data : xData , selected : true });
    this._zoomInToArea(value.lngLat,13);
    return true;
  }
  
  render() {
    const {viewport, data} = this.state;
    const containerStyle = {
      marginTop : "20px",
      marginLeft: "10px"
    }
    const canvasStyle = {
      width : "300px"
    }
    //console.log('Incoming:' + this.state.type);
    if(this.state.type === "screengrid" || this.state.type === 'screengrid2'){
      return(
        <div class="row" style={containerStyle}>
          <MapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/basic-v9"
            onViewportChange={this._onViewportChange.bind(this)}
            mapboxApiAccessToken={MAPBOX_TOKEN}>
            <DeckGLOverlay viewport={viewport}
              data={data}
              cellSize={20}
              />
          </MapGL>
        </div>
      );
    }
    else if(this.state.type === "hexagon" || this.state.type === 'hexagon2'){
      return(
        <div class="row" style={containerStyle}>
          <MapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            onViewportChange={this._onViewportChange.bind(this)}
            mapboxApiAccessToken={MAPBOX_TOKEN}>
            <RoadQualityOverlay
              viewport={viewport}
              data={data || []}
            />
          </MapGL>
        </div>
      );
    }
    return (
      <div class="row" style={containerStyle}>
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          >          
          <SO2LevelOverlay viewport={viewport}
            data={data}
            colorScale={colorScale2}
            elevation={elevation}
            onHover={this._onHover.bind(this)}
            onClick={this._onClick.bind(this)}            
            hovered={this.state.hovered}
            selected={this.state.selected}
          />
        </MapGL>
      </div>
    );
  }
}
render(<Root/>, document.body.appendChild(document.createElement('div')));
