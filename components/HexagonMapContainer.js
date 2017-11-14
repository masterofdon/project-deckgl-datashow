import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import RoadQualityOverlay from './RoadQualityOverlay.js'

export default class HexagonMapContainer extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const {viewport, data} = this.state;
        const containerStyle = {
            marginTop : "20px",
            marginLeft: "10px"
        };
        const canvasStyle = {
            width : "300px"
        };
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
    }

}