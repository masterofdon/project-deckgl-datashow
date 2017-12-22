import React , {Component} from 'react';
import {Popup} from 'react-map-gl';
import IconPopover from './IconPopover';

export default class PopupContent extends Component{
    constructor(props){
        super(props);

    }

    render(){
        const {lngLat, anchor, devices, onItemSelected} = this.props;
        return(
            <Popup longitude={lngLat[0]} latitude={lngLat[1]} anchor={anchor} closeButton={false}>
                <IconPopover header={'Device List'} onItemSelected={onItemSelected} devices={devices}/>
            </Popup>
        );
    }
}