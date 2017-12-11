import React, {Component} from 'react';
import ScreenGridOverlay from './ScreenGridOverlay';
import { json as requestJson } from 'd3-request';

const DATA_URL = 'http://localhost:3030/istanbul_noise_pollution.json';

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
            if (!error) {
                this.setState({ data: response });
            }else {
                console.error(error);
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