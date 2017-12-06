import React, {Component} from 'react';
import ScreenGridOverlay from './ScreenGridOverlay';
import { json as requestJson } from 'd3-request';

const DATA_URL = 'http://localhost:3030/istanbul_noise_pollution.json';
const AUTH_TOKEN = 'Bearer e9f8de1f-e90d-41aa-a628-bc983c4136f1';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWVyZGVtZWtpbiIsImEiOiJjajhtdGRxb2ExMmE5MnZqczljOXA0MDJhIn0.Fo8sD9jDikhVUu72blwRUA'; // eslint-disable-line

export default class ScreenGridMapComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            viewport: {
                ...ScreenGridOverlay.defaultViewport,
                width: 200,
                height: 200
            },
            data : null
        }
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

    render(){
        const {viewport} = this.props;
        const {data} = this.state;
        return(
            <ScreenGridOverlay viewport={viewport}
                data={data}
                cellSize={20}
            />
        );
    }    
}