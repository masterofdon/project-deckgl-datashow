import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import ScreenGridOverlay from './ScreenGridOverlay';
import NoisePollutionOverlay from './NoisePollutionOverlay';
import { json as requestJson } from 'd3-request';

const DATA_URL = 'istanbul_noise_pollution.json';
const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line

export default class ScreenGridMapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...NoisePollutionOverlay.defaultViewport,
                width: 200,
                height: 200
            }
        }
        
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
        requestJson(DATA_URL, (error, response) => {
            //console.log(response);
            if (!error) {
                this.setState({ data: response });
            }
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
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    render() {
        const { viewport, data } = this.state;
        return(
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/aerdemekin/cj9h78aws1tox2rrstvt8luje"
                onViewportChange={this._onViewportChange.bind(this)}
                mapboxApiAccessToken={MAPBOX_TOKEN}>
                <ScreenGridOverlay viewport={viewport}
                    data={data}
                    cellSize={20}
                />
            </MapGL>
        );
    }

}