import React , {Component} from 'react';
import {Popup} from 'react-map-gl';

export default class PopupContent extends Component{
    constructor(props){
        super(props);

    }

    render(){
        const {lngLat, anchor, HTMLContent} = this.props;
        return(
            <Popup longitude={lngLat[0]} latitude={lngLat[1]} anchor={anchor} closeButton={false}>
                <div>Bu ne amk</div>
            </Popup>
        );
    }
}