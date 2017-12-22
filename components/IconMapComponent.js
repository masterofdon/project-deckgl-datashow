import React, { Component } from 'react';
import TaxiRealtimeDataIconOverlay from './TaxiRealtimeDataIconOverlay';
import { request as Request } from 'd3-request';
import {json as requestJson} from 'd3-request';
import mapboxgl from 'mapbox-gl';
import {Popup} from 'react-map-gl';
import Mqtt from 'mqtt';

const DATA_GEOJSON = "http://localhost:3030/example/earthquakes_output.geojson";
const AUTH_TOKEN = "df3600c0-1faa-4fb3-b270-f5e2a0b2e61e";
const PARAMS_GEOJSON = {};
const WEB_SOCKET_ADDR = 'wss://10.254.157.165:30000/ws';
const DEVICE_DATA = 'https://10.254.157.165:30000/api/1.0/devices?&access_token=df3600c0-1faa-4fb3-b270-f5e2a0b2e61e&size=3000&page=0';
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
            deviceArray : null           
        };
        this.websocket = null;
        this.deviceList = null;
        this._requestServerData();
        this._requestIconData();
        this.onPopupShow = this.props.onPopupShow;
        this.lastHovered = null;
        this.onDeviceListUpdated = this.props.onDeviceListUpdated;
        this.websocket = Mqtt.connect(WEB_SOCKET_ADDR, {
            protocol: 'wss',
            username : 'nethackathon',
            password : 'df3600c0-1faa-4fb3-b270-f5e2a0b2e61e'
        });
        this.websocket.on('message',function(topic,message){
            console.log('Incoming Message:\r\n Topic: ' + topic + '\r\n + Message: ' + message);
        });
        //this.websocket.subscribe('topic', () => console.log("Sucbscription success."));
    }

    _requestData(){
        Request(DATA_GEOJSON)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), this._reponseHandler.bind(this));
    }

    _requestData2(callback){
        Request(DATA_GEOJSON)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), callback);
    }

    _responseHandler2(error,response){
        if(error){
            consoler.error("Error while request Icon Data");
            throw new Error("ERROR");
        }
        var features = JSON.parse(response.response).features;
        var i = 0;
        var itemSize = this.state.featureCollection.features.length;
        for(;i < itemSize; i++){
            this.state.featureCollection.features[i].geometry.coordinates = features[i].geometry.coordinates;
        }
        this.setState({
            data : this.state.featureCollection.features
        });
        this.onDeviceListUpdated(this.state.featureCollection);
    }

    _requestServerData(){
        Request(DEVICE_DATA)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), this._serverResponseHandler.bind(this));
    }

    _requestIconData(){
        requestJson('http://localhost:3030/example/location-icon-mapping.json', (error, response) => {
            if (!error) {
              this.setState({iconMapping: response});
            }
          })
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
            this.state.featureCollection.features.push(feature);
            //this.websocket.subscribe(deviceList[i].id,() => null);
            
        }
        this._requestData2(this._responseHandler2.bind(this));
        console.log(this.state.featureCollection);
    }

    _reponseHandler(err,response){
        if(err){
            consoler.error("Error while request Icon Data");
        }
        var features = JSON.parse(response.response).features;
        this.setState({
            data : features
        });
    }

    componentWillUnmount(){
        var deviceListLength = this.deviceList.length;
        var i = 0;
        for(;i<deviceListLength;i++){
            this.websocket.unsubscribe(this.deviceList.id);
        }
        
    }

    _onItemHover(item){
        //console.log('Icon Item Hovered');
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
        
        //console.log('Length: ' + (x ? x.length : 0));
        
    }

    hideToolTip(){
        console.log('Hide Tooltip');
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
        console.log('Show Tooltip: ' + this.lastHovered.id);       
    }

    _onItemClicked(item){
        console.log('Icon Item Clicked');
    }

    render() {
        const {data,iconMapping,showCluster, popupLatLng} = this.state;
        var {viewport} = this.props;
        return (
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
        );
    }

}