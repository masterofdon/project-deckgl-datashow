import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import GeoJsonMapComponent from './GeoJsonMapComponent';
import HexagonMapComponent from './HexagonMapComponent';
import ScreenGridMapComponent from './ScreenGridMapComponent';
import HeatmapComponent from './HeatmapComponent';
import SO2LevelOverlay from './SO2LevelOverlay';
import GeoJsonInfoBox from './GeoJsonInfoBox';
import IconMapComponent from './IconMapComponent';
import PopupContent from './PopupContent';
import IconComponentDetailsInfoBox from './IconComponentDetailsInfoBox';
import ApiStringBuilder from './ApiStringBuilder';
import {request as Request} from 'd3-request';
import axios from 'axios';
import {postDevicePropertiesDetails as RequestDevProperties} from '../core/network/DataAdapter';
import TaskRunner from '../core/task/TaskRunner';
import AuthModule from './AuthModule';
import {criteriaBuilder} from './CriteriaBuilder';
const AUTH_TOKEN = 'fa0546a0-f800-475d-b671-219cafe97129';
const PARAMS_GEOJSON = {};
const test = true;
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line
const ARR_MAPTYPE = [
    'geojson',
    'hexagon',
    'screengrid',
    'heatmap',
    'taxiicon'
];

const ARR_MAPSTYLE = [
    'basic',
    'dark',
    'detailed'
]

export default class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.onMapStateChange = this.props.onMapStateChange;
        this.state = {
            viewport: {
                ...SO2LevelOverlay.defaultViewport,
                width: window.innerWidth,
                height: window.innerHeight * 0.90
            },
            map: null,
            maptype: this.props.maptype,
            mapstyle: this.props.mapstyle,
            popupLatLng : null,
            popupContent : null,
            featurecollection : null,
            selectedDetailsItem : null
        }         
        var authModule = AuthModule.getInstance();
        var authObj = authModule.getAuthObject('itest');
        if(authObj == null){ 
            authModule.authenticateWithUserPass('itest','1234',function(obj){
                this.authobj = obj;
            }.bind(this));    
        }  
        var x = new TaskRunner();
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

    _onGeoJsonItemSelected(selectedItem) {
        var x = Math.random();
        this.setState({
            selectedInfoBoxItem: selectedItem,
            loadingState: 'loading',
            percentage: x
        });
        if (test) {
            setTimeout(function (e) {
                this._onGeoJsonItemDataLoaded.bind(this)();
            }.bind(this), 4000);
        }
    }

    _onGeoJsonItemUnselected() {
        this.setState({
            selectedInfoBoxItem: null,
            loadingState: 'stopped'
        });
    }

    _onGeoJsonItemDataLoaded() {
        this.setState({
            loadingState: 'loaded'
        });
        setTimeout(function (e) {
            this.setState({
                loadingState: 'finished'
            });
        }.bind(this), 4000);
    }

    _onMapStateChange(mapstate) {
        this.onMapStateChange(mapstate);
    }

    _onPopupShow(object){
        this.setState({popupLatLng : object.popupLatLng, popupContent : object.content});
    }

    _onPopupHide(){
        this.setState({popupLatLng : null, popupContent : null});
    }

    _onDeviceSelected(event){
        var devicename = event.currentTarget.getAttribute('data-deviceid');
        //Find the device details.
        var i = 0;
        var len = this.state.featurecollection.features.length;

        for(;i < len;i++){
            if(this.state.featurecollection.features[i].properties.name === devicename){
                //this.setState({selectedDetailsItem : this.state.featurecollection.features[i]});
                this._requestDeviceDetails(this.state.featurecollection.features[i]);
                return;
            }
        }
    }

    _onDeviceListUpdated(featurecollection){
        this.setState({featurecollection : featurecollection});
    }

    _requestDeviceDetails(device){
        var apistrbuilder = new ApiStringBuilder();
        var queryStr = apistrbuilder
            .api('1.0')
            .devices(device.properties.id)
            .details()
            .parameters({
                access_token : this.authobj.access_token
            })
            .toString();
        Request(queryStr)
        .header("Content-Type", "application/json")
        .header('Authorization', this.authobj.access_token)
        .get(JSON.stringify(PARAMS_GEOJSON), this._deviceDetailsResponseHandler.bind(this));   
    }

    _deviceDetailsResponseHandler(error, response){
        var data = (response.response) ? JSON.parse(response.response) : null;
        this._requestDevicePropertiesDetails(data);
    }

    _requestDevicePropertiesDetails(devicedetails){
        RequestDevProperties(devicedetails.device.name,this.authobj.access_token,function(error,response){
            if(error){
                throw new Error("Error while _requestDevicePropertiesDetails");
            }
            var result = JSON.parse(response.response)._embedded.result[0];
            this.setState({
                deviceDetails : result.data
            });
        }.bind(this));
    }

    updateDeviceDetails(devicename,devicedetails){
        
    }

    _devicePropertiesDetailsRequestHandler(error,response){
        if(error){
            throw new Error('Error during handling device properties details request');
        }
        var responseObject = JSON.parse(response.response);
        var result = responseObject._embedded.result;
        this.setState({
            deviceDetails : result[0].data
        });
    }

    _onDeviceDetailsUpdate(devicedetails){
        var x = Object.assign({},{...this.state.deviceDetails},{...devicedetails});
        this.setState({
            deviceDetails : x
        });
    }

    render() {
        var { maptype, mapstyle } = this.props;
        var { selectedInfoBoxItem, loadingState, percentage, viewport, popupLatLng, popupContent ,deviceDetails , featurecol} = this.state;
        var index = ARR_MAPTYPE.indexOf(maptype);
        if (index == -1)
            maptype = 'geojson';
        if (!(maptype === 'geojson')) {
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
                {(maptype === 'taxiicon') && deviceDetails && <IconComponentDetailsInfoBox devicedetails={deviceDetails}/>}
                {(maptype === 'geojson') && <GeoJsonMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)} onMapStateChange={this._onMapStateChange.bind(this)}/>}
                {(maptype === 'hexagon') && <HexagonMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
                {(maptype === 'screengrid') && <ScreenGridMapComponent viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)} />}
                {(maptype === 'taxiicon') && <IconMapComponent onDeviceDetailsUpdated={this._onDeviceDetailsUpdate.bind(this)} selectedDevice={deviceDetails} onDeviceListUpdated={this._onDeviceListUpdated.bind(this)} viewport={viewport} onItemSelected={this._onGeoJsonItemSelected.bind(this)} map={this.state.map} onPopupShow={this._onPopupShow.bind(this)} onPopupHide={this._onPopupHide.bind(this)}/>}
                {(maptype === 'heatmap') && <HeatmapComponent onMapStateChange={this._onMapStateChange.bind(this)} viewport={viewport} map={this.state.map} />}
                {(maptype === 'taxiicon') && popupLatLng && <PopupContent lngLat={popupLatLng} anchor={"top"} devices={popupContent} onItemSelected={this._onDeviceSelected.bind(this)}/>}
                
            </MapGL>
        );
    }

    loadMap(nodeElement) {
        var canvas = nodeElement.getMap().getCanvas();
        this.setState({
            map: nodeElement
        });
    }

}