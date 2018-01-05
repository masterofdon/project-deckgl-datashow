import React, { Component } from 'react';
import TaxiRealtimeDataIconOverlay from './TaxiRealtimeDataIconOverlay';
import { request as Request } from 'd3-request';
import {json as requestJson} from 'd3-request';
import mapboxgl from 'mapbox-gl';
import {Popup} from 'react-map-gl';
import Mqtt from 'mqtt';
import ApiStringBuilder from './ApiStringBuilder';
import AuthModule from './AuthModule';

const AUTH_TOKEN = "d9d2a4da-086e-4393-ae32-b02a140f00cb";
const TOKEN = AUTH_TOKEN;
const PARAMS_GEOJSON = {};
const WEB_SOCKET_ADDR = 'wss://10.254.157.165:30000/ws';
//const DEVICE_DATA = 'https://10.254.157.165:30000/api/1.0/devices?&access_token=df3600c0-1faa-4fb3-b270-f5e2a0b2e61e&size=3000&page=0';
//const DEVICE_DETAILS = 'https://10.254.157.165:30000/api/1.0/devices/5a38b8199c436d0019df687f/details?access_token=df3600c0-1faa-4fb3-b270-f5e2a0b2e61e';
const isNotNull = r => r != null && r != 'undefined';
const isNull = r => r == null || r === 'undefined'

export default class IconMapComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data : null,
            iconMapping : null,
            showCluster : true,
            map : this.props.map,
            popupLatLng : null,
            deviceArray : null,
            selectedDevice : null           
        };
        this.websocket = null;
        this.deviceList = null;        
        this._requestServerData();
        this._requestIconData();
        this.onPopupShow = this.props.onPopupShow;
        this.onPopupHide = this.props.onPopupHide;
        this.lastHovered = null;
        this.onDeviceListUpdated = this.props.onDeviceListUpdated;
        this.onDeviceDetailsUpdated = this.props.onDeviceDetailsUpdated;
        this.websocket = Mqtt.connect(WEB_SOCKET_ADDR, {
            protocol: 'wss',
            username : 'nethackathon',
            password : AuthModule.getInstance().getAuthObject('itest').access_token
        });
        this.websocket.on('message',function(topic,message){
            console.log('Incoming Message:\r\n Topic: ' + topic + '\r\n + Message: ' + message);
            if(this.state.selectedDevice && topic === this.state.selectedDevice.device_id){
                console.log("GELDI");
                this.onDeviceDetailsUpdated(JSON.parse(message));
            }
        }.bind(this));
        
    }
    _requestServerData(){
        var x = AuthModule.getInstance().getAuthObject('itest');
        var apistrbuilder = new ApiStringBuilder();
        var queryStr = apistrbuilder
        .api('1.0')
        .devices()
        .parameters({
            access_token : x.access_token,
            size : 2000
        })
            .toString();
        Request(queryStr)
        .header("Content-Type", "application/json")
        .header('Authorization', TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), this._serverResponseHandler.bind(this));
    }

    _requestIconData(){
        requestJson('http://localhost:3030/example/location-icon-mapping.json', (error, response) => {
            if (!error) {
                this.setState({iconMapping: response});
            }
        });
    }

    _serverResponseHandler(err, response){
        if(err){
            throw new Error("Error on Server Request");
        }
        var outer = JSON.parse(response.response);
        this.deviceList = outer._embedded.deviceList;
        const fields = [
            'address',
            'administrationStatus',
            'capability',
            'id',
            'lastUpdateDate',
            'name',
            'online'
        ];
        this.state.deviceArray = [];
        this.state.featureCollection = {};
        this.state.featureCollection.type = "FeatureCollection";
        this.state.featureCollection.crs = {};
        this.state.featureCollection.crs.type = "name";
        this.state.featureCollection.crs.properties = {};
        this.state.featureCollection.crs.properties.name = "urn:ogc:def:crs:OGC:1.3:CRS84";
        this.state.featureCollection.features = [];
        var deviceListLength = this.deviceList.length;
        var fieldsLength = fields.length;
        var i = 0;
        for(;i<deviceListLength;i++){
            var feature = {};
            feature.type = "Feature";
            feature.properties = {};
            feature.geometry = {};
            feature.geometry.type = "Point";
            feature.geometry.coordinates = [];
            for(var j = 0;j < fieldsLength ; j++){
                feature.properties[fields[j]] = this.deviceList[i][fields[j]];
            }            
            if(!isNull(feature.properties.address.fixedLocation)){
                feature.geometry.coordinates.push(feature.properties.address.fixedLocation.longitude);
                feature.geometry.coordinates.push(feature.properties.address.fixedLocation.latitude);
                this.state.featureCollection.features.push(feature);
            }
            
            
        }
        this.setState({
            data : this.state.featureCollection.features
        });
        this.onDeviceListUpdated(this.state.featureCollection);
    }

    componentWillUnmount(){
        var deviceListLength = this.deviceList.length;
        var i = 0;
        for(;i<deviceListLength;i++){
            this.websocket.unsubscribe(this.deviceList[i].name);
        }
        this.setState({
            popupLatLng : null
        });   
    }

    _onItemHover(item){
        var {viewport} = this.props;
        const z = Math.floor(viewport.zoom);
        var x = item.object && item.object.zoomLevels[z].points;
        if(x == null){
            this.lastHovered = null;
            this.hideToolTip();
            return;
        } else if(isNull(this.lastHovered)){
           this.lastHovered = item.object.properties.id;
           this.showToolTip(item);
        }
    }

    hideToolTip(){
        this.onPopupHide();
    }

    showToolTip(item){
        var {viewport} = this.props;
        const z = Math.floor(viewport.zoom);
        var x = item.object && item.object.zoomLevels[z].points;
        var items = item.object.zoomLevels[z].points;
        var {map} = this.state;
        map = map.getMap();
        var lngLat = map.unproject(new mapboxgl.Point(item.x,item.y))
        var object = {};
        object.popupLatLng = [lngLat.lng,lngLat.lat];
        object.content = [];
        for(var i=0;i < items.length;i++){
            object.content.push(items[i].properties);
        }
        this.onPopupShow(object);   
    }

    _onItemClicked(item){
    }

    render() {
        const {data,iconMapping,showCluster, popupLatLng} = this.state;
        var {selectedDevice} = this.props;        
        if(isNotNull(this.state.selectedDevice) && this.state.selectedDevice.device_id != selectedDevice.device_id){
            console.log("UnSubscribing to: " + this.state.selectedDevice.device_id);
            this.websocket.unsubscribe(this.state.selectedDevice.device_id);
        }
        this.state.selectedDevice = selectedDevice;
        if(isNotNull(this.state.selectedDevice)){
            console.log("Subscribing to: " + this.state.selectedDevice.device_id);
            this.websocket.subscribe(this.state.selectedDevice.device_id);
        }
        var {viewport} = this.props;
        return (
            <div>
                <TaxiRealtimeDataIconOverlay
                    viewport={viewport}
                    data={data}
                    iconAtlas="../assets/img/location-icon-atlas.png"
                    iconMapping={iconMapping}
                    showCluster={showCluster}
                    onHover={this._onItemHover.bind(this)}
                    onClick={this._onItemClicked.bind(this)}
                >            
                </TaxiRealtimeDataIconOverlay>
            </div>
        );
    }

}