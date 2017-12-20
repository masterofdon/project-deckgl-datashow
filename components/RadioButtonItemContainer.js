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
            selected : this.props.selected,
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
        var isGeoJsonSelected = false, isHexagonSelected = false, isScreengridSelected = false, isHeatMapSelected = false, isTaxiIconSelected = false;
        if(selected === 'geojson')
            isGeoJsonSelected = true;
        else if(selected === 'hexagon')
            isHexagonSelected = true;
        else if(selected === 'screengrid')
            isScreengridSelected = true;
        else if(selected === 'heatmap'){
            isHeatMapSelected = true;
        }else if(selected === 'taxiicon'){
            isTaxiIconSelected = true;
        }
        else{
            isGeoJsonSelected = true;
        }    
        return(
            <div className={'maptype-radiobutton-container indent-2'}>                
                <RadioButtonItem selected={isGeoJsonSelected} mapTypeStr={'SO2 Level'}  maptype={'geojson'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isHexagonSelected} mapTypeStr={'Road Quality'} maptype={'hexagon'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isScreengridSelected} mapTypeStr={'Air Quality'} maptype={'screengrid'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isHeatMapSelected} mapTypeStr={'Noise Pol.'} maptype={'heatmap'} onclick={this.onClickHandler.bind(this)}/>
                <RadioButtonItem selected={isTaxiIconSelected} mapTypeStr={'Taxi Icon'} maptype={'taxiicon'} onclick={this.onClickHandler.bind(this)}/>
            </div>
        );
    }

}