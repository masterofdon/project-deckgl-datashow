import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import GeoJsonMapComponent from './GeoJsonMapComponent';
import HexagonMapComponent from './HexagonMapComponent';
import ScreenGridMapComponent from './ScreenGridMapComponent';
import HeatmapComponent from './HeatmapComponent';
import SO2LevelOverlay from './SO2LevelOverlay';
import GeoJsonInfoBox from './GeoJsonInfoBox';

const test = true;
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line
const ARR_MAPTYPE = [
    'geojson',
    'hexagon',
    'screengrid',
    'heatmap'
];

const ARR_MAPSTYLE = [
    'basic',
    'dark',
    'detailed'
]

export default class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...SO2LevelOverlay.defaultViewport,
                width: window.innerWidth,
                height : window.innerHeight * 0.90
            },
            map : null,
            maptype: this.props.maptype,
            mapstyle: this.props.mapstyle
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight * 0.90
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    _changeMapType(maptype) {
        this.setState({
            maptype: maptype
        });
    }

    _onGeoJsonItemSelected(selectedItem){
        var x = Math.random();
        this.setState({
          selectedInfoBoxItem : selectedItem,
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
          selectedInfoBoxItem : null,
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

    render() {
        var {maptype, mapstyle } = this.props;
        var {selectedInfoBoxItem, loadingState, percentage,viewport} = this.state;
        var index = ARR_MAPTYPE.indexOf(maptype);
        if (index == -1)
            maptype = 'geojson';
        if(!(maptype === 'geojson')){
            selectedInfoBoxItem = null;
        }
        return (
            <MapGL
                {...viewport}
                mapStyle={mapstyle}
                onViewportChange={this._onViewportChange.bind(this)}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                ref={nodeElement => nodeElement && !this.state.map && this.loadMap(nodeElement)}>
                {(maptype === 'geojson') && selectedInfoBoxItem && <GeoJsonInfoBox selecteditem={selectedInfoBoxItem} name={selectedInfoBoxItem.name} loadingState={loadingState} percentage={percentage} />}
                {(maptype === 'geojson') && <GeoJsonMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)}/>}
                {(maptype === 'hexagon') && <HexagonMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)}/>}
                {(maptype === 'screengrid') && <ScreenGridMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)}/>}
                {(maptype === 'heatmap') && <HeatmapComponent viewport={viewport} map={this.state.map}/>}
            </MapGL>
        );
    }

    loadMap(nodeElement){
        this.setState({
            map: nodeElement
        });
    }

}