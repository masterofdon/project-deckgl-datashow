import React, {Component} from 'react';

import RadioButtonItemContainer from './RadioButtonItemContainer';

const STR_SELECTIONS = [
    'so2level',
    'noisepollution',
    'airquality',
    'roadquality'
]

export default class MapTypeController extends Component {

    constructor(props){
        super(props);
        this.state  = {
            selected : '1'
        }
        
    }
    static get defaultConfig(){
        return {

        }
    }

    onButtonClick(item){
        console.log("Item Clicked: " + item);
    }

    render(){
        return(
            <RadioButtonItemContainer onNewItemSelected={this.onButtonClick.bind(this)} maptype={'geojson'}/>
        );
    }

}