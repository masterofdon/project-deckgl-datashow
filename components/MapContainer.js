import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import RoadQualityOverlay from './RoadQualityOverlay.js'
import SO2LevelOverlay from './so2-levels-overlay.js'
import GeoJsonMapContainer from './GeoJsonMapContainer';

const ARR_MAPTYPE = [
    'geojson',
    'hexagon',
    'screengrid'
]

export default class MapContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            maptype : this.props.maptype
        }
    }

    render(){
        var {maptype} = this.props;
        var index = ARR_MAPTYPE.indexOf(maptype);
        if(index == -1)
            maptype = 'geojson';
        
        <div class="row" style={containerStyle}>
            <MapGL
            {...viewport}
            mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
            onViewportChange={this._onViewportChange.bind(this)}
            mapboxApiAccessToken={MAPBOX_TOKEN}>
            {(maptype == 'geojson') && <GeoJsonMapContainer />}
            {(maptype == 'hexagon') && <GeoJsonMapContainer />}
            {(maptype == 'screengrid') && <GeoJsonMapContainer />}
            </MapGL>
        </div>
    }

}