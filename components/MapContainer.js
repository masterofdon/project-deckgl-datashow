import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import RoadQualityOverlay from './RoadQualityOverlay.js'
import SO2LevelOverlay from './so2-levels-overlay.js'

export default class MapContainer extends Component{

    constructor(props){
        super(props);
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
        this.objectSelected(currently_selected_item);
        this.props.onItemSelected(value.object);
        return true;
    }

    render(){
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
    }

}