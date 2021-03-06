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
            selected : this.props.maptype,
            onItemChange : this.props.onChange
        }
        
    }
    static get defaultConfig(){
        return {

        }
    }

    onButtonClick(item){
        if(item !== this.state.selected){
            this.state.selected = 'item';
            this.state.onItemChange(item);
        }
        console.log('Clicked: ' + item);
    }

    render(){
        const {selected} = this.state;
        return(
            <RadioButtonItemContainer selected={selected} onNewItemSelected={this.onButtonClick.bind(this)}/>
        );
    }

}