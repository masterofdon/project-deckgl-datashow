import React, {Component} from 'react';

import InfoBoxHeader from './InfoBoxHeader';

export default class GeoJsonInfoBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            name : this.props.name,
            locale : 'tr',
            object : this.props.selectedItem,
        }
    }

    render(){
        return(
            <div class="row infobox-container dark-p1-bg">
                <InfoBoxHeader displaytext={this.state.name}/>
            </div>
        );
    }
}