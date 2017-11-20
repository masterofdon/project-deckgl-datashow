import React, {Component} from 'react';

import RadioButtonItem from './RadioButtonItem';

const STR_MAPTYPE = [
    'SO2 Levels',
    'Noise Pol.',
    'Road Quality',
    'Air Quality'
]
export default class RadioButtonItemContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            selected : 'geojson',
            onNewItemSelected : this.props.onNewItemSelected
        }
    }

    onClickHandler(itemname){
        if(this.state.selected !== itemname){
            this.setState({
                selected : itemname
            });
            this.state.onNewItemSelected(itemname);
        }
    }

    render(){
        var {selected} = this.state;
        var isGeoJsonSelected = false, isHexagonSelected = false, isScreengridSelected = false;
        if(selected === 'geojson')
            isGeoJsonSelected = true;
        else if(selected === 'hexagon')
            isHexagonSelected = true;
        else if(selected === 'screengrid')
            isScreengridSelected = true;
        else{
            isGeoJsonSelected = true;
        }    
        return(
            <div className={'container maptype-radiobutton-container'}>                
                <RadioButtonItem selected={isGeoJsonSelected}  maptype={'geojson'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isHexagonSelected} maptype={'hexagon'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isScreengridSelected} maptype={'screengrid'} onclick={this.onClickHandler.bind(this)}/>
            </div>
        );
    }

}