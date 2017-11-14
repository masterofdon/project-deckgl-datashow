import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import NoisePollutionOverlay from '../NoisePollutionOverlay.js'
import { json as requestJson } from 'd3-request';

const DATA_URL = 'istanbul_noise_pollution.json';

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
        requestJson(DATA_URL, (error, response) => {
            //console.log(response);
            if (!error) {
                this.setState({ data: response });
            }
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth * 0.99,
            height: window.innerHeight * 0.75
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    render() {
        const { viewport, data } = this.state;
        const containerStyle = {
            marginTop: "20px",
            marginLeft: "10px"
        };
        const canvasStyle = {
            width: "300px"
        };
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
    }

}