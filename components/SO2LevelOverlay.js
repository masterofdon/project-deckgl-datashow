import React, {Component} from 'react';
import {start as StartPerf, end as EndPerf} from './Performancer';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
    lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [1.0, 0.0, 2.0, 0.0],
    numberOfLights: 2
};

export default class SO2LevelOverlay extends Component {

    static get defaultViewport() {
        return {
          longitude: 29.1,
          latitude: 41.015,
          zoom: 10.2,
          maxZoom: 20,
          minZoom: 10,
          pitch: 33,
          bearing: 14.3
        };
      }

    _initialize(gl) {
        // setParameters(gl, {
        //     depthTest: true,
        //     depthFunc: gl.LEQUAL
        // });
    }

    componentDidUpdate(){
        console.log("SO2: ComponentDidUpdate");
    }

    componentDidMount(){
        console.log("SO2: ComponentDidMount");
    }

    render() {
        StartPerf("RenderSOOverlay");
        const {viewport, data, colorScale , elevation , hovered, selected} = this.props;
        if (!data) {
            EndPerf("RenderSOOverlay");
            return null;
        }

        const layer = new GeoJsonLayer({
            id: 'geojson',
            data,
            opacity: 1,
            stroked: false,
            filled: true,
            extruded: true,
            wireframe: true,
            fp64: false,
            getElevation: f => elevation(f.properties.selected || f.properties.hovered),
            updateTriggers: {
                getElevation: [hovered,selected]
            },
            getFillColor: f => colorScale(f.properties.value , f.properties.selected || f.properties.hovered),
            getLineColor: f => [255,255,255],
            lightSettings: LIGHT_SETTINGS,
            pickable: true,
            onHover: this.props.onHover,
            onClick : this.props.onClick
        });
        EndPerf("RenderSOOverlay");
        return (
            <DeckGL {...viewport} useDevicePixels={false} layers={ [layer]}/>
        );
    }
}
