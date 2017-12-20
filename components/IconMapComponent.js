import React, { Component } from 'react';
import TaxiRealtimeDataIconOverlay from './TaxiRealtimeDataIconOverlay';
import { request as Request } from 'd3-request';
import {json as requestJson} from 'd3-request';
import mapboxgl from 'mapbox-gl';
import {Popup} from 'react-map-gl';
import Mqtt from 'mqtt';

const DATA_GEOJSON = "http://localhost:3030/example/earthquakes_output.geojson";
const AUTH_TOKEN = "";
const PARAMS_GEOJSON = {};
const WEB_SOCKET_ADDR = 'wss://ion.netas.com.tr:30000/ws';

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
           
        };
        this.websocket = null;
        this._requestData();
        this._requestIconData();
        this.onPopupShow = this.props.onPopupShow;
        this.lastHovered = null;
        // this.websocket = Mqtt.connect(WEB_SOCKET_ADDR, {
        //     protocol: 'wss',
        //     username : 'nethackathon',
        //     password : '1234'
        // });
        // this.websocket.on('message',function(topic,message){
        //     console.log('Incoming Message:\r\n Topic: ' + topic + '\r\n + Message: ' + message);
        // });
        // this.websocket.subscribe('topic', () => console.log("Sucbscription success."));
    }

    _requestData(){
        Request(DATA_GEOJSON)
        .header("Content-Type", "application/json")
        .header('Authorization', AUTH_TOKEN)
        .get(JSON.stringify(PARAMS_GEOJSON), this._reponseHandler.bind(this));
    }

    _requestIconData(){
        requestJson('http://localhost:3030/example/location-icon-mapping.json', (error, response) => {
            if (!error) {
              this.setState({iconMapping: response});
            }
          })
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
           this.lastHovered = item.object;
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
        var popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false
        });
        map = map.getMap();
        var lngLat = map.unproject(new mapboxgl.Point(item.x,item.y))
        var object = {};
        object.popupLatLng = [lngLat.lng,lngLat.lat];
        object.content = '';
        for(var i=0;i < items.length;i++){
            object.content += '<p>' + items[i].properties.id + '</p>';
        }
        this.onPopupShow(object);
        //this.setState({popupLatLng : flAr})    
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